const express = require('express');
const router  = express.Router();
const { getDailyReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

router.get('/today', protect, getDailyReminder);

module.exports = router;