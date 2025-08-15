const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Feedback = require('../models/Feedback');
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth');
const { ROLES } = require('../../shared/constants');

/**
 * @swagger
 * /stats/overview:
 *   get:
 *     summary: Get overview statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date (YYYY-MM-DD)
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date
 *         description: End date (YYYY-MM-DD)
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/overview', authenticate, async (req, res) => {
  try {
    const { from, to, clientId } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to + 'T23:59:59.999Z');
    }

    // Build client filter
    if (clientId) {
      dateFilter.clientId = clientId;
    }

    // Role-based access
    if (req.user.role === ROLES.MEMBER) {
      const userTasks = await Task.find({ assigneeIds: req.user.id }).select('_id');
      dateFilter._id = { $in: userTasks.map(t => t._id) };
    }

    // Task statistics
    const taskStats = await Task.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
          totalEstimatedHours: { $sum: '$estimateHours' },
          totalActualHours: { $sum: '$actualHours' },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgressTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          }
        }
      }
    ]);

    // Calculate average completion duration for completed tasks
    const completionStats = await Task.aggregate([
      { 
        $match: { 
          ...dateFilter, 
          status: 'completed',
          completedAt: { $exists: true },
          createdAt: { $exists: true }
        } 
      },
      {
        $addFields: {
          durationHours: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert milliseconds to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgCompletionDuration: { $avg: '$durationHours' },
          minCompletionDuration: { $min: '$durationHours' },
          maxCompletionDuration: { $max: '$durationHours' }
        }
      }
    ]);

    // Revenue by client
    const revenueByClient = await Task.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $group: {
          _id: '$clientId',
          clientName: { $first: '$client.name' },
          clientTier: { $first: '$client.tier' },
          revenue: { $sum: '$revenue' },
          taskCount: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Feedback statistics (CSAT)
    const feedbackStats = await Feedback.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'task'
        }
      },
      { $unwind: '$task' },
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalFeedback: { $sum: 1 },
          avgScore: { $avg: '$score' },
          scoreDistribution: {
            $push: '$score'
          }
        }
      }
    ]);

    // Calculate score distribution
    let scoreDistribution = {};
    if (feedbackStats.length > 0 && feedbackStats[0].scoreDistribution) {
      const scores = feedbackStats[0].scoreDistribution;
      scoreDistribution = {
        1: scores.filter(s => s === 1).length,
        2: scores.filter(s => s === 2).length,
        3: scores.filter(s => s === 3).length,
        4: scores.filter(s => s === 4).length,
        5: scores.filter(s => s === 5).length
      };
    }

    // Prepare response
    const stats = {
      tasks: {
        total: taskStats[0]?.totalTasks || 0,
        completed: taskStats[0]?.completedTasks || 0,
        pending: taskStats[0]?.pendingTasks || 0,
        inProgress: taskStats[0]?.inProgressTasks || 0,
        completionRate: taskStats[0]?.totalTasks ? 
          (taskStats[0].completedTasks / taskStats[0].totalTasks * 100).toFixed(1) : 0
      },
      revenue: {
        total: taskStats[0]?.totalRevenue || 0,
        byClient: revenueByClient
      },
      hours: {
        estimated: taskStats[0]?.totalEstimatedHours || 0,
        actual: taskStats[0]?.totalActualHours || 0,
        efficiency: taskStats[0]?.totalActualHours && taskStats[0]?.totalEstimatedHours ?
          (taskStats[0].totalEstimatedHours / taskStats[0].totalActualHours * 100).toFixed(1) : 0
      },
      completion: {
        avgDuration: completionStats[0]?.avgCompletionDuration ? 
          completionStats[0].avgCompletionDuration.toFixed(1) : 0,
        minDuration: completionStats[0]?.minCompletionDuration ? 
          completionStats[0].minCompletionDuration.toFixed(1) : 0,
        maxDuration: completionStats[0]?.maxCompletionDuration ? 
          completionStats[0].maxCompletionDuration.toFixed(1) : 0
      },
      feedback: {
        total: feedbackStats[0]?.totalFeedback || 0,
        avgScore: feedbackStats[0]?.avgScore ? 
          feedbackStats[0].avgScore.toFixed(1) : 0,
        scoreDistribution
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

/**
 * @swagger
 * /stats/trends:
 *   get:
 *     summary: Get trend statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [daily, weekly, monthly]
 *           default: monthly
 *         description: Time period for trends
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Trend statistics retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/trends', authenticate, async (req, res) => {
  try {
    const { period = 'monthly', days = 30 } = req.query;
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - (parseInt(days) * 24 * 60 * 60 * 1000));

    // Role-based access
    let taskFilter = { createdAt: { $gte: startDate, $lte: endDate } };
    if (req.user.role === ROLES.MEMBER) {
      const userTasks = await Task.find({ assigneeIds: req.user.id }).select('_id');
      taskFilter._id = { $in: userTasks.map(t => t._id) };
    }

    // Group by time period
    let groupBy = {};
    if (period === 'daily') {
      groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
    } else if (period === 'weekly') {
      groupBy = { $dateToString: { format: '%Y-W%U', date: '$createdAt' } };
    } else {
      groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
    }

    // Task trends
    const taskTrends = await Task.aggregate([
      { $match: taskFilter },
      {
        $group: {
          _id: groupBy,
          tasks: { $sum: 1 },
          revenue: { $sum: '$revenue' },
          completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Feedback trends
    const feedbackTrends = await Feedback.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'task'
        }
      },
      { $unwind: '$task' },
      { $match: taskFilter },
      {
        $group: {
          _id: groupBy,
          feedback: { $sum: 1 },
          avgScore: { $avg: '$score' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      period,
      days: parseInt(days),
      taskTrends,
      feedbackTrends
    });
  } catch (error) {
    console.error('Trends retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve trends' });
  }
});

/**
 * @swagger
 * /stats/clients:
 *   get:
 *     summary: Get client statistics
 *     tags: [Stats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client statistics retrieved successfully
 *       403:
 *         description: Access denied
 */
router.get('/clients', authenticate, async (req, res) => {
  try {
    // Role-based access
    let taskFilter = {};
    if (req.user.role === ROLES.MEMBER) {
      const userTasks = await Task.find({ assigneeIds: req.user.id }).select('_id');
      taskFilter._id = { $in: userTasks.map(t => t._id) };
    }

    // Client performance statistics
    const clientStats = await Task.aggregate([
      { $match: taskFilter },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $group: {
          _id: '$clientId',
          clientName: { $first: '$client.name' },
          clientTier: { $first: '$client.tier' },
          totalTasks: { $sum: 1 },
          totalRevenue: { $sum: '$revenue' },
          completedTasks: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          avgTaskValue: { $avg: '$revenue' },
          totalHours: { $sum: '$actualHours' }
        }
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $gt: ['$totalTasks', 0] },
              { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Client feedback statistics
    const clientFeedback = await Feedback.aggregate([
      {
        $lookup: {
          from: 'tasks',
          localField: 'taskId',
          foreignField: '_id',
          as: 'task'
        }
      },
      { $unwind: '$task' },
      { $match: taskFilter },
      {
        $lookup: {
          from: 'clients',
          localField: 'clientId',
          foreignField: '_id',
          as: 'client'
        }
      },
      { $unwind: '$client' },
      {
        $group: {
          _id: '$clientId',
          clientName: { $first: '$client.name' },
          avgScore: { $avg: '$score' },
          totalFeedback: { $sum: 1 }
        }
      }
    ]);

    // Merge client stats with feedback
    const mergedStats = clientStats.map(stat => {
      const feedback = clientFeedback.find(f => f._id.toString() === stat._id.toString());
      return {
        ...stat,
        avgScore: feedback?.avgScore ? feedback.avgScore.toFixed(1) : 'N/A',
        totalFeedback: feedback?.totalFeedback || 0
      };
    });

    res.json({
      clients: mergedStats,
      summary: {
        totalClients: mergedStats.length,
        totalRevenue: mergedStats.reduce((sum, client) => sum + client.totalRevenue, 0),
        avgCompletionRate: mergedStats.length > 0 ? 
          (mergedStats.reduce((sum, client) => sum + client.completionRate, 0) / mergedStats.length).toFixed(1) : 0
      }
    });
  } catch (error) {
    console.error('Client stats retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve client statistics' });
  }
});

module.exports = router;
