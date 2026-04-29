const Habit = require('../models/Habit');
const { checkHabitBadges } = require('../utils/badgeChecker');

// Helper to strip time from a date for exact day matching
const getStartOfDay = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Get all user habits
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res, next) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(habits);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Please provide a habit name' });
    }

    const habit = await Habit.create({
      user: req.user.id,
      name,
      currentStreak: 0,
      longestStreak: 0,
      logs: []
    });

    await checkHabitBadges(req.user.id);

    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Check user ownership
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await habit.deleteOne();
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// @desc    Check off/log a habit for today
// @route   PATCH /api/habits/:id/log
// @access  Private
const logHabitToday = async (req, res, next) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const today = getStartOfDay();
    
    // Check if we already have a log for today
    const logIndex = habit.logs.findIndex(log => 
      getStartOfDay(log.date).getTime() === today.getTime()
    );

    let isDone = true;

    if (logIndex >= 0) {
      // Toggle logic
      isDone = !habit.logs[logIndex].done;
      habit.logs[logIndex].done = isDone;
    } else {
      // Create new log for today
      habit.logs.push({ date: today, done: true });
    }

    // --- Simple Habit Streak Logic ---
    // If checking off for today, increment current streak (assuming it wasn't done already today).
    // Note: Full streak repair logic might need sorting logs to see if yesterday was checked,
    // but a light-weight approach is to increment/decrement based on the toggle state.
    if (isDone) {
      // Simplistic behavior: increment if newly marked done.
      habit.currentStreak += 1;
      if (habit.currentStreak > habit.longestStreak) {
        habit.longestStreak = habit.currentStreak;
      }
    } else {
      // If unchecking, subtract 1
      habit.currentStreak = Math.max(0, habit.currentStreak - 1);
    }

    await habit.save();

    res.status(200).json(habit);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHabits,
  createHabit,
  deleteHabit,
  logHabitToday
};