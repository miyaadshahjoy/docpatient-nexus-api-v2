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

// POST/doctors/appointments/:id/prescription
router.use('/:id/prescription', prescriptionRouter);

// Cancel Appointment
// PATCH /patients/appointments/{appointmentId}/cancel-appointment
router.patch(
  '/:id/cancel-appointment',
  authController.protect(),
  authController.restrictTo('patient'),
  appointmentController.cancelAppointment,
);

// Get all appointments
router.get(
  '/',
  authController.protect(),
  authController.restrictTo('admin', 'appointment-manager'),
  handlerFactory.readAll(Appointment),
);

router
  .route('/:id')
  .get(
    authController.protect(),
    authController.restrictTo('admin', 'appointment-manager'),
    handlerFactory.readOne(Appointment),
  )
  .patch(
    authController.protect(),
    authController.restrictTo('admin', 'appointment-manager'),
    handlerFactory.updateOne(Appointment),
  );
module.exports = router;
