const mongoose = require('mongoose');

const winSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  title: { 
    type: String, 
    required: true,
    maxlength: 120 
  },
  description: { 
    type: String 
  },
  size: { 
    type: String,
    enum: ['small', 'medium', 'big'],
    default: 'small'
  },
  mood: { 
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Win', winSchema);