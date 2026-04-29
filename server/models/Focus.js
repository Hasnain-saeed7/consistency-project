const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  text: { type: String, required: true },
  done: { type: Boolean, default: false },
  doneAt: { type: Date }
});

const focusSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  date: { 
    type: Date, 
    required: true 
  },
  goals: [goalSchema],
  review: {
    rating: { type: Number, min: 1, max: 10 },
    highlight: { type: String },
    tomorrow: { type: String }
  },
  weeklyGoal: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Focus', focusSchema);