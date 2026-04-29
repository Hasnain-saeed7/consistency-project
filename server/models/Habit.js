const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  done: { type: Boolean, default: false }
}, { _id: false });

const habitSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  name: { 
    type: String, 
    required: true 
  },
  currentStreak: { 
    type: Number, 
    default: 0 
  },
  longestStreak: { 
    type: Number, 
    default: 0 
  },
  logs: [logSchema]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Habit', habitSchema);