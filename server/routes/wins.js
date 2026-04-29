
// const express      = require('express');
// const router       = express.Router();
// const { protect }  = require('../middleware/auth');

// const {
//   getWins,
//   createWin,
//   deleteWin,
//   getWinStats
// } = require('../controllers/winController');

// router.route('/')
//   .get(protect, getWins)
//   .post(protect, createWin);

// router.get('/stats', protect, getWinStats);

// router.delete('/:id', protect, deleteWin);

// module.exports = router;















const express     = require('express');
const router      = express.Router();
const auth        = require('../middleware/auth');
const Win         = require('../models/Win');
const checkBadges = require('../utils/badgeChecker');

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const wins  = await Win.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Win.countDocuments({ user: req.user.id });
    res.json({ wins, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/stats', auth, async (req, res) => {
  try {
    const userId  = req.user.id;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [total, thisWeek, bySize] = await Promise.all([
      Win.countDocuments({ user: userId }),
      Win.countDocuments({ user: userId, createdAt: { $gte: weekAgo } }),
      Win.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId(userId) } },
        { $group: { _id: '$size', count: { $sum: 1 } } },
      ]),
    ]);
    res.json({ total, thisWeek, bySize });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { title, description, size, mood, tags } = req.body;
    const win = await Win.create({
      user: req.user.id,
      title, description, size, mood,
      tags: (tags || []).map(t => t.toLowerCase().trim()),
    });
    const newBadges = await checkBadges(req.user.id);
    // Always return { win, newBadges }
    res.status(201).json({ win, newBadges });
  } catch (err) {
    console.error('Win POST error:', err);
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Win.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;