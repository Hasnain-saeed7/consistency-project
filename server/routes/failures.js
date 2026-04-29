// const express = require('express');
// const router = express.Router();
// const {
//   getFailures,
//   createFailure,
//   deleteFailure
// } = require('../controllers/failureController');
// const { protect } = require('../middleware/auth');

// router.route('/')
//   .get(protect, getFailures)
//   .post(protect, createFailure);

// router.route('/:id')
//   .delete(protect, deleteFailure);

// module.exports = router;

























const express     = require('express');
const router      = express.Router();
const auth        = require('../middleware/auth');
const Failure     = require('../models/Failure');
const Reminder    = require('../models/Reminder');
const checkBadges = require('../utils/badgeChecker');

// GET all failures
router.get('/', auth, async (req, res) => {
  try {
    const failures = await Failure.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(failures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create failure
router.post('/', auth, async (req, res) => {
  try {
    const { title, cause, lesson, category } = req.body;
    const failure = await Failure.create({
      user: req.user.id,
      title, cause, lesson, category,
      date: new Date(),
    });

    // Save lesson to reminder pool
    if (lesson) {
      await Reminder.create({
        user:     req.user.id,
        text:     lesson,
        sourceId: failure._id,
      });
    }

    // Check badges
    const newBadges = await checkBadges(req.user.id);

    // Always return { failure, newBadges }
    res.status(201).json({ failure, newBadges });
  } catch (err) {
    console.error('Failure POST error:', err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE failure
router.delete('/:id', auth, async (req, res) => {
  try {
    const failure = await Failure.findOneAndDelete({
      _id:  req.params.id,
      user: req.user.id,
    });
    if (failure?.lesson) {
      await Reminder.deleteOne({ sourceId: failure._id });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;