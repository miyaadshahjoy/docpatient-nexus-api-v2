const express = require('express');
const calendarController = require('../controllers/calendarController');
const authController = require('../controllers/authController');

const router = express.Router();

// POST /doctors/me/calendar
router.post(
  '/',
  authController.protect(),
  authController.restrictTo('doctor'),
  calendarController.generateOAuthURL,
);

module.exports = router;
