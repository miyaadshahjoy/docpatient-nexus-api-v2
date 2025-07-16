const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');

const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// POST/doctors/appointments/{appointmentId}/prescription
router.post(
  '/',
  authController.protect(),
  authController.restrictTo('doctor'),
  prescriptionController.createPrescription,
);

// PATCH /api/v2/doctors/appointments/{appointmentId}/prescription/
router.patch(
  '/',
  authController.protect(),
  authController.restrictTo('doctor'),
  prescriptionController.updatePrescription,
);

module.exports = router;
