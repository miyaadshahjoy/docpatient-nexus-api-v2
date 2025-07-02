const express = require('express');
const handlerFactory = require('../controllers/handlerFactory');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const Review = require('../models/reviewModel');

const router = express.Router({ mergeParams: true });

// POST/patients/appointments/{appointmentId}/reviews
router.post(
  '/',
  authController.protect(),
  authController.restrictTo('patient'),
  reviewController.postReview,
);

// PATCH/patients/appointments/{appointmentId}/reviews
router.patch(
  '/',
  authController.protect(),
  authController.restrictTo('patient'),
  reviewController.updateReview,
);

router.get('/', handlerFactory.readAll(Review));

router.delete('/:id', handlerFactory.deleteOne(Review));

module.exports = router;
