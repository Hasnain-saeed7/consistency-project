const express = require('express');
const router = express.Router();
const {
  getTodayFocus,
  setTodayFocus,
  toggleGoal,
  submitReview,
  getFocusHistory
} = require('../controllers/focusController');
const auth = require('../middleware/auth');

router.route('/today')
  .get(auth, getTodayFocus)
  .post(auth, setTodayFocus);

router.get('/history', auth, getFocusHistory);

router.patch('/:id/goal/:i', auth, toggleGoal);
router.patch('/:id/review', auth, submitReview);

module.exports = router;
