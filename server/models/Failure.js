const mongoose = require('mongoose');

const failureSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  title: { 
    type: String, 
    required: true 
  },
  cause: { 
    type: String 
  },
  lesson: { 
    type: String,
    required: true
  },
  category: { 
    type: String 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Failure', failureSchema);