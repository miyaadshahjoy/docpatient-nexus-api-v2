const express = require('express');
const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');
const handlerFactory = require('../controllers/handlerFactory');
const reviewRouter = require('./reviewRoutes');
const prescriptionRouter = require('./prescriptionRoutes');
const Appointment = require('../models/appointmentModel');

const router = express.Router({ mergeParams: true });

// POST/patients/appointments/{appointmentId}/reviews
router.use('/:id/reviews', reviewRouter);

// POST /api/v2/doctors/appointments/{appointmentId}/prescription
// PATCH /api/v2/doctors/appointments/{appointmentId}/prescription
router.use('/:id/prescription', prescriptionRouter);

// Cancel Appointment
// PATCH /patients/appointments/{appointmentId}/cancel-appointment
router.patch(
  '/:id/cancel-appointment',
  authController.protect(),
  authController.restrictTo('patient'),
  appointmentController.cancelAppointment,
);

router.get(
  // Get all appointments
  '/',
  authController.protect(),
  authController.restrictTo('admin', 'appointment-manager'),
  handlerFactory.readAll(Appointment),
);

router
  .route('/:id')
  .get(
    // Get appointment by id
    authController.protect(),
    authController.restrictTo('admin', 'appointment-manager'),
    handlerFactory.readOne(Appointment),
  )
  .patch(
    // Update appointment by id
    authController.protect(),
    authController.restrictTo('admin', 'appointment-manager'),
    handlerFactory.updateOne(Appointment),
  )
  .delete(
    // Delete appointment by ID
    authController.protect(),
    authController.restrictTo('admin', 'appointment-manager'),
    handlerFactory.deleteOne(Appointment),
  );
module.exports = router;
