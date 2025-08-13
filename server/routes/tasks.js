const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Client = require('../models/Client');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { ROLES } = require('../../shared/constants');

// Helper function to check task ownership
const isTaskOwner = (task, userId) => {
  return task.createdBy.toString() === userId.toString();
};

// Helper function to check if user is assigned to task
const isTaskAssignee = (task, userId) => {
  return task.assigneeIds.some(id => id.toString() === userId.toString());
};

// Helper function to check if user can read task
const canReadTask = (task, user) => {
  if (user.role === ROLES.MANAGER) return true;
  if (isTaskOwner(task, user._id)) return true;
  if (isTaskAssignee(task, user._id)) return true;
  return false;
};

// Helper function to check if user can write task
const canWriteTask = (task, user) => {
  if (user.role === ROLES.MANAGER && isTaskOwner(task, user._id)) return true;
  if (user.role === ROLES.LEADER) return true;
  if (isTaskAssignee(task, user._id)) return true;
  return false;
};

// Helper function to check if user can assign tasks
const canAssignTasks = (user) => {
  return user.role === ROLES.MANAGER || user.role === ROLES.LEADER;
};

// GET /tasks - Get all tasks with RBAC filtering
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, clientId, search } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    
    if (req.user.role === ROLES.MANAGER) {
      // Manager can see all tasks
    } else if (req.user.role === ROLES.LEADER) {
      // Leader can see all tasks
    } else {
      // Member can only see assigned tasks or own tasks
      query.$or = [
        { assigneeIds: req.user._id },
        { createdBy: req.user._id }
      ];
    }

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (clientId) query.clientId = clientId;
    
    // Handle search filter
    if (search) {
      const searchQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
      
      // If we already have an $or condition (for role-based filtering), use $and
      if (query.$or) {
        query.$and = [query.$or, searchQuery];
        delete query.$or;
      } else {
        query.$or = searchQuery.$or;
      }
    }

    const tasks = await Task.findWithPopulate(query)
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /tasks/:id - Get single task
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('clientId', 'name tier')
      .populate('assigneeIds', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (!canReadTask(task, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /tasks - Create new task
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, clientId, assigneeIds, priority, estimateHours, revenue } = req.body;

    // Validate required fields
    if (!title || !description || !clientId) {
      return res.status(400).json({ message: 'Title, description, and client are required' });
    }

    // Check if client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(400).json({ message: 'Client not found' });
    }

    // Validate assignees if provided
    if (assigneeIds && assigneeIds.length > 0) {
      const users = await User.find({ _id: { $in: assigneeIds } });
      if (users.length !== assigneeIds.length) {
        return res.status(400).json({ message: 'One or more assignees not found' });
      }
    }

    const task = new Task({
      title,
      description,
      clientId,
      assigneeIds: assigneeIds || [],
      priority: priority || 'medium',
      estimateHours: estimateHours || 0,
      revenue: revenue || 0,
      createdBy: req.user._id
    });

    await task.save();
    
    const populatedTask = await Task.findById(task._id)
      .populate('clientId', 'name tier')
      .populate('assigneeIds', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /tasks/:id - Update task
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check permissions
    if (!canWriteTask(task, req.user)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, description, status, priority, estimateHours, actualHours, revenue, assigneeIds } = req.body;

    // Role-based field restrictions
    const updates = {};
    
    // All roles can update these fields if they have write permission
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (status !== undefined) updates.status = status;
    if (actualHours !== undefined) updates.actualHours = actualHours;

    // Only Manager (owner) and Leader can update these fields
    if (req.user.role === ROLES.MANAGER || req.user.role === ROLES.LEADER) {
      if (priority !== undefined) updates.priority = priority;
      if (estimateHours !== undefined) updates.estimateHours = estimateHours;
      if (revenue !== undefined) updates.revenue = revenue;
    }

    // Only Manager (owner) and Leader can assign tasks
    if (canAssignTasks(req.user) && assigneeIds !== undefined) {
      // Validate assignees
      if (assigneeIds.length > 0) {
        const users = await User.find({ _id: { $in: assigneeIds } });
        if (users.length !== assigneeIds.length) {
          return res.status(400).json({ message: 'One or more assignees not found' });
        }
      }
      updates.assigneeIds = assigneeIds;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('clientId', 'name tier')
     .populate('assigneeIds', 'name email')
     .populate('createdBy', 'name email');

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /tasks/:id - Delete task
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only task creator (Manager) can delete
    if (!isTaskOwner(task, req.user._id)) {
      return res.status(403).json({ message: 'Only task creator can delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /tasks/stats/overview - Get task statistics
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    const { from, to } = req.query;
    let dateFilter = {};
    
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to);
    }

    // Role-based filtering
    if (req.user.role === ROLES.MEMBER) {
      dateFilter.$or = [
        { assigneeIds: req.user._id },
        { createdBy: req.user._id }
      ];
    }

    const stats = await Task.aggregate([
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

    const result = stats[0] || {
      totalTasks: 0,
      totalRevenue: 0,
      totalEstimatedHours: 0,
      totalActualHours: 0,
      completedTasks: 0,
      pendingTasks: 0,
      inProgressTasks: 0
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching task stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
