const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth');
const { ROLES } = require('../../shared/constants');

/**
 * @swagger
 * /feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - taskId
 *               - clientId
 *               - score
 *             properties:
 *               taskId:
 *                 type: string
 *               clientId:
 *                 type: string
 *               score:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback created successfully
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { taskId, clientId, score, comment } = req.body;
    const userId = req.user.id;

    // Validate task exists and is completed
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.status !== 'completed') {
      return res.status(400).json({ error: 'Can only provide feedback for completed tasks' });
    }

    // Validate client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Check if feedback already exists for this task
    const existingFeedback = await Feedback.findOne({ taskId });
    if (existingFeedback) {
      return res.status(400).json({ error: 'Feedback already exists for this task' });
    }

    const feedback = new Feedback({
      taskId,
      clientId,
      score,
      comment,
      createdBy: userId
    });

    await feedback.save();

    // Populate references for response
    await feedback.populate([
      { path: 'taskId', select: 'title status' },
      { path: 'clientId', select: 'name tier' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.status(201).json({
      message: 'Feedback created successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback creation error:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

/**
 * @swagger
 * /feedback:
 *   get:
 *     summary: Get feedback list
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback list retrieved successfully
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, clientId, score } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (clientId) filter.clientId = clientId;
    if (score) filter.score = parseInt(score);

    // Role-based access
    if (req.user.role === ROLES.MEMBER) {
      const userTasks = await Task.find({ assigneeIds: req.user.id }).select('_id');
      filter.taskId = { $in: userTasks.map(t => t._id) };
    }

    const feedback = await Feedback.find(filter)
      .populate([
        { path: 'taskId', select: 'title status' },
        { path: 'clientId', select: 'name tier' },
        { path: 'createdBy', select: 'name email' }
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Feedback retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
});

/**
 * @swagger
 * /feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback retrieved successfully
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate([
        { path: 'taskId', select: 'title status description' },
        { path: 'clientId', select: 'name tier contact' },
        { path: 'createdBy', select: 'name email role' }
      ]);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Role-based access check
    if (req.user.role === ROLES.MEMBER) {
      const task = await Task.findById(feedback.taskId._id);
      if (!task.assigneeIds.includes(req.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json({ feedback });
  } catch (error) {
    console.error('Feedback retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve feedback' });
  }
});

/**
 * @swagger
 * /feedback/{id}:
 *   put:
 *     summary: Update feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 */
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { score, comment } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Only creator can update feedback
    if (feedback.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields
    if (score !== undefined) feedback.score = score;
    if (comment !== undefined) feedback.comment = comment;

    await feedback.save();

    // Populate references for response
    await feedback.populate([
      { path: 'taskId', select: 'title status' },
      { path: 'clientId', select: 'name tier' },
      { path: 'createdBy', select: 'name email' }
    ]);

    res.json({
      message: 'Feedback updated successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback update error:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

/**
 * @swagger
 * /feedback/{id}:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }

    // Only creator or manager can delete feedback
    if (feedback.createdBy.toString() !== req.user.id && req.user.role !== ROLES.MANAGER) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Feedback.findByIdAndDelete(req.params.id);

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Feedback deletion error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;
