// const mongoose = require('mongoose');

// const badgeSchema = new mongoose.Schema({
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     required: true, 
//     ref: 'User' 
//   },
//   type: { 
//     type: String, 
//     enum: [
//       'first_win', 'wins_5', 'wins_10', 
//       'honest', 
//       'streak_3', 'streak_7', 'streak_30', 
//       'habits_3'
//     ],
//     required: true 
//   },
//   earnedAt: { 
//     type: Date, 
//     default: Date.now 
//   }
// });

// // A user should only earn a specific badge once
// badgeSchema.index({ user: 1, type: 1 }, { unique: true });

// module.exports = mongoose.model('Badge', badgeSchema);





















const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: [
      'first_win', 'wins_5', 'wins_10', 'wins_25',
      'streak_3', 'streak_7', 'streak_10', 'streak_30', 'streak_100',
      'honest', 'honest_10',
      'habits_3', 'comeback',
    ],
    required: true,
  },
  earnedAt: { type: Date, default: Date.now },
}, { timestamps: true });

badgeSchema.index({ user: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Badge', badgeSchema);