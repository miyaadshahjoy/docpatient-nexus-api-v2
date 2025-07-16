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

// Get all prescriptions for a Patient
// GET /api/v2/patients/{patientId}/prescriptions
router.get(
  '/',
  authController.protect(),
  authController.restrictTo('admin', 'prescription-manager'),
  prescriptionController.getAllPrescriptions,
);

// Get a single prescription by ID for a patient
// GET /api/v2/patients/{patientId}/prescriptions/{prescriptionId}/
router.get(
  '/:prescriptionId',
  authController.protect(),
  authController.restrictTo('admin', 'prescription-manager'),
  prescriptionController.getPrescription,
);

// Update a single prescription for a Patient
// PATCH /api/v2/patients/{patientId}/prescriptions/{prescriptionId}
router.patch(
  '/:prescriptionId',
  authController.protect(),
  authController.restrictTo('admin', 'prescription-manager'),
  prescriptionController.updateOnePrescription,
);

// Delete a single prescription for a Patient
// DELETE /api/v2/patients/{patientId}/prescriptions/{prescriptionId}
router.delete(
  '/:prescriptionId',
  authController.protect(),
  authController.restrictTo('admin', 'prescription-manager'),
  prescriptionController.deleteOnePrescription,
);

module.exports = router;
