const express = require('express');
const authController = require('../controllers/authController');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

// POST/patients/payments/checkout-session
router.post(
  '/checkout-session',
  authController.protect(),
  authController.restrictTo('patient'),
  paymentController.createCheckoutSession,
);

module.exports = router;
