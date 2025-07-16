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

// Get all reviews for a Doctor
// GET /api/v2/doctors/{doctorId}/reviews
router.get(
  '/',
  authController.protect(),
  authController.restrictTo('admin', 'review-manager'),
  reviewController.getAllReviews,
);

// Get one single review by ID for a Doctor
// GET /api/v2/doctors/{doctorId}/reviews/{reviewId}/
router.get(
  '/:reviewId',
  authController.protect(),
  authController.restrictTo('admin', 'review-manager'),
  reviewController.getReview,
);

router.delete('/:id', handlerFactory.deleteOne(Review));

module.exports = router;
