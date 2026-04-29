const Focus = require('../models/Focus');
const { calculateStreak } = require('../utils/streakHelper');

// Helper to get start and end of current day
const getTodayRange = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

// @desc    Get today's focus doc
// @route   GET /api/focus/today
// @access  Private
const getTodayFocus = async (req, res, next) => {
  try {
    const { start, end } = getTodayRange();
    
    let focus = await Focus.findOne({
      user: req.user.id,
      date: { $gte: start, $lt: end }
    });
    
    // Send 200 with focus or null if not yet created for today
    res.status(200).json(focus || null);
  } catch (error) {
    next(error);
  }
};

// @desc    Set today's goals
// @route   POST /api/focus/today
// @access  Private
const setTodayFocus = async (req, res, next) => {
  try {
    const { goals, weeklyGoal } = req.body;
    
    if (goals && goals.length > 3) {
      return res.status(400).json({ message: 'Maximum 3 goals allowed' });
    }

    const { start, end } = getTodayRange();

    // Map string strings to goal sub-document objects
    let formattedGoals = [];
    if (goals) {
      formattedGoals = goals.map(text => ({ text, done: false }));
    }

    let focus = await Focus.findOne({
      user: req.user.id,
      date: { $gte: start, $lt: end }
    });

    if (focus) {
      // Update existing
      focus.goals = formattedGoals;
      if (weeklyGoal !== undefined) focus.weeklyGoal = weeklyGoal;
      await focus.save();
    } else {
      // Create new
      focus = await Focus.create({
        user: req.user.id,
        date: start,
        goals: formattedGoals,
        weeklyGoal
      });
    }

    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle goal done
// @route   PATCH /api/focus/:id/goal/:i
// @access  Private
const toggleGoal = async (req, res, next) => {
  try {
    const { id, i } = req.params;
    const focus = await Focus.findById(id);

    if (!focus) {
      return res.status(404).json({ message: 'Focus not found' });
    }

    // Ensure user owns this focus log
    if (focus.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const goalIndex = parseInt(i, 10);
    
    // Check bounds
    if (goalIndex >= 0 && goalIndex < focus.goals.length) {
      // Toggle
      const isDone = !focus.goals[goalIndex].done;
      focus.goals[goalIndex].done = isDone;
      focus.goals[goalIndex].doneAt = isDone ? new Date() : null;
      
      await focus.save();
      res.status(200).json(focus);
    } else {
      res.status(400).json({ message: 'Invalid goal index' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Submit evening review
// @route   PATCH /api/focus/:id/review
// @access  Private
const submitReview = async (req, res, next) => {
  try {
    const { rating, highlight, tomorrow } = req.body;
    const focus = await Focus.findById(req.params.id);

    if (!focus) {
      return res.status(404).json({ message: 'Focus not found' });
    }

    // Ensure user owns this focus log
    if (focus.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Embed review
    focus.review = { rating, highlight, tomorrow };
    await focus.save();

    // PHASE 1 STEP 4: Update Streak on Evening Review completion
    await calculateStreak(req.user.id);
    
    res.status(200).json(focus);
  } catch (error) {
    next(error);
  }
};

// @desc    Past focus docs
// @route   GET /api/focus/history
// @access  Private
const getFocusHistory = async (req, res, next) => {
  try {
    const history = await Focus.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodayFocus,
  setTodayFocus,
  toggleGoal,
  submitReview,
  getFocusHistory
};
