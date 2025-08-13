const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number cannot be more than 20 characters']
    },
    address: {
      type: String,
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters']
    }
  },
  tier: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
clientSchema.index({ name: 1 });
clientSchema.index({ 'contact.email': 1 });
clientSchema.index({ tier: 1 });
clientSchema.index({ createdBy: 1 });

// Method to get public client data
clientSchema.methods.toPublicJSON = function() {
  const client = this.toObject();
  return client;
};

module.exports = mongoose.model('Client', clientSchema);
