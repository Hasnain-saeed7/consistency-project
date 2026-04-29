const Badge = require('../models/Badge');

// @desc    Get all earned badges for the current user
// @route   GET /api/badges/me
// @access  Private
const getMyBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ user: req.user.id }).sort({ earnedAt: -1 });
    
    res.status(200).json(badges);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyBadges
};