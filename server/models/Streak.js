const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  current: { 
    type: Number, 
    default: 0 
  },
  longest: { 
    type: Number, 
    default: 0 
  },
  lastActiveDate: { 
    type: Date 
  },
  comebacks: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Streak', streakSchema);