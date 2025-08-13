const express = require('express');
const Client = require('../models/Client');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all client routes
router.use(authenticate);

// GET /clients - Get all clients (with role-based filtering)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tier } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    
    // If user is not manager, they can only see clients they created
    if (req.user.role !== 'manager') {
      query.createdBy = req.user._id;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Add tier filter
    if (tier) {
      query.tier = tier;
    }

    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Client.countDocuments(query);

    res.json({
      clients: clients.map(client => client.toPublicJSON()),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get clients error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET /clients/:id - Get single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    // Check if user has permission to view this client
    if (req.user.role !== 'manager' && client.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    res.json(client.toPublicJSON());
  } catch (error) {
    console.error('Get client error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid client ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// POST /clients - Create new client
router.post('/', async (req, res) => {
  try {
    const { name, contact, tier = 'basic', notes } = req.body;

    // Validate required fields
    if (!name || !contact || !contact.email) {
      return res.status(400).json({
        error: 'Name and contact email are required'
      });
    }

    // Create new client
    const client = new Client({
      name,
      contact,
      tier,
      notes,
      createdBy: req.user._id
    });

    await client.save();

    // Populate creator info
    await client.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Client created successfully',
      client: client.toPublicJSON()
    });
  } catch (error) {
    console.error('Create client error:', error);
    
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

// PUT /clients/:id - Update client
router.put('/:id', async (req, res) => {
  try {
    const { name, contact, tier, notes } = req.body;

    // Find client
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    // Check if user has permission to update this client
    if (req.user.role !== 'manager' && client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    // Update fields
    if (name !== undefined) client.name = name;
    if (contact !== undefined) client.contact = contact;
    if (tier !== undefined) client.tier = tier;
    if (notes !== undefined) client.notes = notes;

    await client.save();

    // Populate creator info
    await client.populate('createdBy', 'name email');

    res.json({
      message: 'Client updated successfully',
      client: client.toPublicJSON()
    });
  } catch (error) {
    console.error('Update client error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid client ID'
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

// DELETE /clients/:id - Delete client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({
        error: 'Client not found'
      });
    }

    // Check if user has permission to delete this client
    if (req.user.role !== 'manager' && client.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied'
      });
    }

    await Client.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid client ID'
      });
    }

    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;
