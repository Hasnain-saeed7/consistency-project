const Streak = require('../models/Streak');

// @desc    Get current user's streak stats
// @route   GET /api/streaks/me
// @access  Private
const getMyStreak = async (req, res, next) => {
  try {
    let streak = await Streak.findOne({ user: req.user.id });

    // If User hasn't done their first review, return an empty template struct
    if (!streak) {
      return res.status(200).json({
        current: 0,
        longest: 0,
        comebacks: 0,
        lastActiveDate: null
      });
    }

    // Optional check: You can passively reset streak to 0 if they request their
    // streak and haven't logged in over 48h (missed yesterday & today entirely)
    // But since the core logic updates upon the action itself, we can just return exact DB values.
    
    res.status(200).json(streak);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyStreak
};