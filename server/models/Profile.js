const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [16, 'Must be at least 16'],
    max: [99, 'Age must be under 100'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: [true, 'Gender is required'],
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: '',
  },
  // --- Compatibility Preferences ---
  budget: {
    type: Number,
    required: [true, 'Monthly budget is required'],
    min: [100, 'Budget must be at least $100'],
  },
  sleepSchedule: {
    type: String,
    enum: ['early-bird', 'night-owl', 'flexible'],
    required: [true, 'Sleep schedule is required'],
  },
  cleanliness: {
    type: Number,
    required: [true, 'Cleanliness level is required'],
    min: 1,
    max: 5,
  },
  smoking: {
    type: String,
    enum: ['yes', 'no', 'occasional'],
    required: [true, 'Smoking preference is required'],
  },
  drinking: {
    type: String,
    enum: ['yes', 'no', 'occasional'],
    required: [true, 'Drinking preference is required'],
  },
  interests: {
    type: [String],
    default: [],
  },
  lookingFor: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any',
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
