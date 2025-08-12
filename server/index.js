const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Piece of Cake server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Piece of Cake API',
    version: '1.0.0',
    endpoints: {
      health: '/healthz'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Piece of Cake server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/healthz`);
});
