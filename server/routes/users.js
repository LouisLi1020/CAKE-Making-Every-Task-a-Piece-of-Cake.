const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all user routes
router.use(authenticate);

// Middleware to check if user is manager
const requireManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({
      error: 'Access denied. Manager role required.'
    });
  }
  next();
};

// GET /users - Get all users (manager only)
router.get('/', requireManager, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Add role filter
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users: users.map(user => user.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /users/:id - Get single user (manager only)
router.get('/:id', requireManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user.toPublicJSON());
  } catch (error) {
    console.error('Get user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// PUT /users/:id - Update user (manager only)
router.put('/:id', requireManager, async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    await user.save();

    res.json({
      message: 'User updated successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: Object.values(error.errors).map(err => err.message).join(', ')
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// DELETE /users/:id - Delete user (manager only)
router.delete('/:id', requireManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid user ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
