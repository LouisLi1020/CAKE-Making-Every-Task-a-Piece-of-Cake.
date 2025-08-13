const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cake';

// Connect to MongoDB
console.log('🔌 Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Server will start without database connection');
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'C.A.K.E server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to C.A.K.E API',
    version: '1.0.0',
    endpoints: {
      health: '/healthz',
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
        me: 'GET /auth/me'
      },
      clients: {
        list: 'GET /clients',
        create: 'POST /clients',
        get: 'GET /clients/:id',
        update: 'PUT /clients/:id',
        delete: 'DELETE /clients/:id'
      },
      users: {
        list: 'GET /users',
        get: 'GET /users/:id',
        update: 'PUT /users/:id',
        delete: 'DELETE /users/:id'
      },
      tasks: {
        list: 'GET /tasks',
        create: 'POST /tasks',
        get: 'GET /tasks/:id',
        update: 'PUT /tasks/:id',
        delete: 'DELETE /tasks/:id',
        stats: 'GET /tasks/stats/overview'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 C.A.K.E server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/auth`);
});
