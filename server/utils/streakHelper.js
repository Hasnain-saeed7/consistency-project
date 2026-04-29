const Streak = require('../models/Streak');
const { checkStreakBadges } = require('./badgeChecker');

// Streak update algorithm
const calculateStreak = async (userId) => {
  const now = new Date();
  
  // Normalize today's date (strip time) for accurate day-to-day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let streak = await Streak.findOne({ user: userId });

  // If no streak doc exists at all, initialize the first one!
  if (!streak) {
    streak = await Streak.create({
      user: userId,
      current: 1,
      longest: 1,
      lastActiveDate: now,
      comebacks: 0
    });
    return streak;
  }

  // Ensure lastActiveDate exists to avoid math errors on migrated docs
  if (!streak.lastActiveDate) {
    streak.current = 1;
    streak.longest = Math.max(1, streak.longest);
    streak.lastActiveDate = now;
    await streak.save();
    return streak;
  }

  // Normalize last active date
  const lastActive = new Date(streak.lastActiveDate);
  const lastActiveDay = new Date(
    lastActive.getFullYear(), 
    lastActive.getMonth(), 
    lastActive.getDate()
  );

  // Calculate day difference
  const diffTime = today.getTime() - lastActiveDay.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // If it was today -> no change (already counted).
    // Just update the exact time to now.
    streak.lastActiveDate = now;
  } else if (diffDays === 1) {
    // If it was yesterday -> increment current
    streak.current += 1;
    streak.lastActiveDate = now;
    
    // Update longest if current exceeds it
    if (streak.current > streak.longest) {
      streak.longest = streak.current;
    }
  } else if (diffDays > 1) {
    // Anything else (skipped 1 or more days) -> reset current to 1, increment comebacks
    streak.current = 1;
    streak.comebacks += 1;
    streak.lastActiveDate = now;
  }

  await streak.save();

  // Run badgeChecker to award streaks based on milestones
  await checkStreakBadges(userId);

  return streak;
};

module.exports = { calculateStreak };