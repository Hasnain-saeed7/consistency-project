const express = require('express');
const router = express.Router();
const {
  getMyBadges
} = require('../controllers/badgeController');
const auth  = require('../middleware/auth');

router.get('/me', auth, getMyBadges);

module.exports = router;