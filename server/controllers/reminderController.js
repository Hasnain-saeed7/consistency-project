const Reminder = require('../models/Reminder');
const mongoose = require('mongoose');

// @desc    Get 1 random lesson reminder (for frontend dashboard banner)
// @route   GET /api/reminders/today
// @access  Private
const getDailyReminder = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Use MongoDB $sample to pull exactly 1 random item efficiently
    const reminders = await Reminder.aggregate([
      { $match: { user: userId } },
      { $sample: { size: 1 } }
    ]);

    if (reminders.length === 0) {
      return res.status(200).json(null);
    }

    const randomReminder = reminders[0];

    // Optionally update shownAt timestamp
    await Reminder.findByIdAndUpdate(randomReminder._id, {
      shownAt: new Date()
    });

    res.status(200).json(randomReminder);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDailyReminder
};