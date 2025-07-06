const express = require('express');
const calendarController = require('../controllers/calendarController');
// const authController = require('../controllers/authController');

const router = express.Router();

router.post(
  '/',
  //   authController.protect(), // TODO: Uncomment this when we have a login system on the frontend
  //   authController.restrictTo('doctor'),
  calendarController.createCalendar,
);

module.exports = router;
