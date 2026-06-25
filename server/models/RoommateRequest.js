const mongoose = require('mongoose');

const roommateRequestSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  message: {
    type: String,
    maxlength: [300, 'Message cannot exceed 300 characters'],
    default: '',
  },
}, { timestamps: true });

roommateRequestSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('RoommateRequest', roommateRequestSchema);
