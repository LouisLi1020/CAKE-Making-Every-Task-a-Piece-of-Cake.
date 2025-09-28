const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskNumber: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Task description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client ID is required']
  },
  assigneeIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  estimateHours: {
    type: Number,
    min: [0, 'Estimated hours cannot be negative'],
    default: 0
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative'],
    default: 0
  },
  revenue: {
    type: Number,
    min: [0, 'Revenue cannot be negative'],
    default: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
taskSchema.index({ createdBy: 1 });
taskSchema.index({ assigneeIds: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ clientId: 1 });
taskSchema.index({ priority: 1 });

// Virtual for task duration
taskSchema.virtual('duration').get(function() {
  if (this.startedAt && this.completedAt) {
    return Math.ceil((this.completedAt - this.startedAt) / (1000 * 60 * 60)); // hours
  }
  return null;
});

// Pre-save middleware to generate task number and update timestamps
taskSchema.pre('save', async function(next) {
  // Generate task number if it's a new task
  if (this.isNew && !this.taskNumber) {
    try {
      const count = await this.constructor.countDocuments();
      this.taskNumber = `TASK-${String(count + 1).padStart(3, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  
  if (this.isModified('status')) {
    if (this.status === 'in-progress' && !this.startedAt) {
      this.startedAt = new Date();
    } else if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

// Static method to get tasks with populated references
taskSchema.statics.findWithPopulate = function(query = {}) {
  return this.find(query)
    .populate('clientId', 'name tier')
    .populate('assigneeIds', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Task', taskSchema);
