const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Feedback title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Feedback description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  type: {
    type: String,
    required: [true, 'Feedback type is required'],
    enum: {
      values: ['bug', 'feature', 'improvement', 'other'],
      message: 'Type must be one of: bug, feature, improvement, other'
    }
  },
  priority: {
    type: String,
    required: [true, 'Feedback priority is required'],
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be one of: low, medium, high'
    }
  },
  status: {
    type: String,
    required: [true, 'Feedback status is required'],
    enum: {
      values: ['open', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be one of: open, in-progress, resolved, closed'
    },
    default: 'open'
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Score must be an integer'
    }
  },
  comment: {
    type: String,
    maxlength: 1000,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
feedbackSchema.index({ taskId: 1, clientId: 1 });
feedbackSchema.index({ createdAt: -1 });

// Virtual for score description
feedbackSchema.virtual('scoreDescription').get(function() {
  const descriptions = {
    1: 'Very Dissatisfied',
    2: 'Dissatisfied', 
    3: 'Neutral',
    4: 'Satisfied',
    5: 'Very Satisfied'
  };
  return descriptions[this.score] || 'Unknown';
});

// Ensure virtuals are serialized
feedbackSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
