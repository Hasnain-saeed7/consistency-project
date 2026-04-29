// const express = require('express');
// const router = express.Router();
// const {
//   getHabits,
//   createHabit,
//   deleteHabit,
//   logHabitToday
// } = require('../controllers/habitController');
// const { protect } = require('../middleware/auth');

// router.route('/')
//   .get(protect, getHabits)
//   .post(protect, createHabit);

// router.route('/:id')
//   .delete(protect, deleteHabit);

// router.patch('/:id/log', protect, logHabitToday);

// module.exports = router;






































const express     = require('express');
const router      = express.Router();
const auth        = require('../middleware/auth');
const Habit       = require('../models/Habit');
const checkBadges = require('../utils/badgeChecker');
// Add temporarily at TOP of habits.js before any routes:
console.log('auth type:', typeof require('../middleware/auth'));
console.log('Habit type:', typeof require('../models/Habit'));

router.get('/', auth, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const habit = await Habit.create({
      user: req.user.id,
      name: req.body.name,
    });
    const newBadges = await checkBadges(req.user.id);
    res.status(201).json({ habit, newBadges });
  } catch (err) {
    console.error('Habit POST error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/log', auth, async (req, res) => {
  try {
    const habit   = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ message: 'Not found' });

    const today   = new Date();
    today.setHours(0, 0, 0, 0);

    const alreadyLogged = habit.logs?.some(l => {
      const d = new Date(l.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime() && l.done;
    });

    if (alreadyLogged) {
      // Untoggle
      habit.logs = habit.logs.filter(l => {
        const d = new Date(l.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() !== today.getTime();
      });
      habit.currentStreak = Math.max(0, (habit.currentStreak || 1) - 1);
    } else {
      habit.logs = habit.logs || [];
      habit.logs.push({ date: today, done: true });
      habit.currentStreak  = (habit.currentStreak || 0) + 1;
      habit.longestStreak  = Math.max(habit.longestStreak || 0, habit.currentStreak);
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error('Habit log error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;