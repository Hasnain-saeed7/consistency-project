// 

















const Badge  = require('../models/Badge');
const Streak = require('../models/Streak');
const Win    = require('../models/Win');
const Habit  = require('../models/Habit');

const BADGE_RULES = [
  // Win badges
  { type: 'first_win',   check: async (uid) => await Win.countDocuments({ user: uid }) >= 1  },
  { type: 'wins_5',      check: async (uid) => await Win.countDocuments({ user: uid }) >= 5  },
  { type: 'wins_10',     check: async (uid) => await Win.countDocuments({ user: uid }) >= 10 },
  { type: 'wins_25',     check: async (uid) => await Win.countDocuments({ user: uid }) >= 25 },

  // Streak badges — including the new 10-day
  { type: 'streak_3',   check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.longest >= 3;  } },
  { type: 'streak_7',   check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.longest >= 7;  } },
  { type: 'streak_10',  check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.longest >= 10; } },
  { type: 'streak_30',  check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.longest >= 30; } },
  { type: 'streak_100', check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.longest >= 100;} },

  // Honesty badge
  { type: 'honest',     check: async (uid) => await require('../models/Failure').countDocuments({ user: uid }) >= 1 },
  { type: 'honest_10',  check: async (uid) => await require('../models/Failure').countDocuments({ user: uid }) >= 10 },

  // Habit badges
  { type: 'habits_3',   check: async (uid) => await Habit.countDocuments({ user: uid }) >= 3 },
  { type: 'comeback',   check: async (uid) => { const s = await Streak.findOne({ user: uid }); return s?.comebacks >= 1; } },
];

async function checkBadges(userId) {
  const newlyEarned = [];
  for (const rule of BADGE_RULES) {
    const already = await Badge.findOne({ user: userId, type: rule.type });
    if (already) continue;
    const earned = await rule.check(userId);
    if (earned) {
      await Badge.create({ user: userId, type: rule.type });
      newlyEarned.push(rule.type);
    }
  }
  return newlyEarned; // return so routes can send them to frontend
}

module.exports = checkBadges;