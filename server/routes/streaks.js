const express = require('express');
const router = express.Router();
const {
  getMyStreak
} = require('../controllers/streakController');
const auth = require('../middleware/auth');

router.get('/me', auth, getMyStreak);

module.exports = router;