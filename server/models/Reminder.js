const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  text: { 
    type: String, 
    required: true 
  },
  sourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Failure',
    required: true
  },
  shownAt: { 
    type: Date 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Reminder', reminderSchema);