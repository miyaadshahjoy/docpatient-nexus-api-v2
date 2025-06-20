const email = require('../utils/email');
const { DateTime } = require('luxon');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { getAvailableSlots } = require('../services/appointmentService');
const {
  sendAppointmentNotification,
} = require('../services/notificationService');
const { scheduleAppointmentReminder } = require('../services/reminderService');

exports.checkVisitingHours = catchAsync(async (req, res, next) => {
  const { date } = req.body;
  const doctorId = req.params.id;
  if (!date) return next(new AppError('Please provide a date', 400));

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));

  const dayOfWeek = DateTime.fromISO(date).toFormat('cccc').toLowerCase();
  const availableSlots = await getAvailableSlots(doctor, date);

  res.status(200).json({
    status: 'success',
    message: 'Available visiting time slots retrieved successfully',
    data: {
      date,
      visitingDay: dayOfWeek,
      visitingHours: availableSlots,
    },
  });
});

// Booking appointments
exports.bookAppointment = catchAsync(async (req, res, next) => {
  const doctorId = req.params.id;
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));
  req.body.doctor = doctor._id;

  const patientId = req.user._id;
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient exists with this Id', 404));
  req.body.patient = patient._id;

  const date = req.body.appointmentDate;
  if (!date)
    return next(new AppError('Please provide an appointment date', 400));

  const availableSlots = await getAvailableSlots(doctor, date);

  const requestedSlot = req.body.appointmentSchedule;
  if (!requestedSlot?.hours?.from || !requestedSlot?.hours?.to) {
    return next(new AppError('Invalid appointment schedule provided', 400));
  }
  const isSlotAvailable = availableSlots.some(
    (s) =>
      s.from === requestedSlot.hours.from && s.to === requestedSlot.hours.to,
  );

  if (!isSlotAvailable)
    return next(
      new AppError(
        'Requested appointment schedule is not available. Request for a different time slot',
        400,
      ),
    );

  // Impl: You must book an appointment 24 hours in advance
  // Check if the requested time slot is at least 24 hours from now
  // const now = new Date();
  const requestedDate = new Date(date);

  const requestedTime = new Date(
    requestedDate.setHours(
      ...requestedSlot.hours.from.split(':').map(Number),
      0,
      0,
    ),
  );
  console.log(requestedDate, new Date());
  if (requestedDate.getTime() - Date.now() < 86400000)
    return next(
      new AppError('❌ You must book an appointment 24 hours in advance', 400),
    );
  // Book the appointment
  try {
    const appointment = await Appointment.create(req.body);

    try {
      await sendAppointmentNotification(appointment, doctor, patient);
    } catch (err) {
      console.error('❌ Failed to send appointment notification:', err.message);
    }

    // Schedule appointment reminder
    // TODO: We have to test it
    /*
    scheduleAppointmentReminder({
      to: patient.email,
      subject: 'Your appointment is scheduled',
      message: `Your appointment with Dr. ${doctor.name} is scheduled for ${date} at ${requestedSlot.hours.from}-${requestedSlot.hours.to}.`,
      sendAt: new Date(appointment.appointmentDate),
    });
    scheduleAppointmentReminder({
      to: doctor.email,
      subject: 'New appointment scheduled',
      message: `A new appointment with ${patient.name} is scheduled for ${date} at ${requestedSlot.hours.from}-${requestedSlot.hours.to}.`,
      sendAt: new Date(appointment.appointmentDate),
    });
    */
    res.status(201).json({
      status: 'success',
      message: 'Appointment created successfully',
      data: {
        appointment,
      },
    });
  } catch (err) {
    console.error('❌ Failed to book an appointment:', err);
    return next(
      new AppError('Internal error. Failed to book an appointment', 500),
    );
  }
});

exports.cancelAppointment = catchAsync(async (req, res, next) => {
  // 1) Check if the appointment exists with the id
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment found with the provided Id', 404));
  // 2) Check if the doctor exists in the DB
  const doctor = await Doctor.findById(appointment.doctor);
  if (!doctor)
    return next(
      new AppError(`The doctor of this appointment no longer exists.`, 404),
    );
  // 3) Check if the patient exists in the DB

  if (!appointment.patient.equals(req.user._id))
    return next(
      new AppError('You are not authorized to perform this action', 403),
    );
  const patient = await Patient.findById(appointment.patient);
  if (!patient)
    return next(
      new AppError(
        'The patient who booked this appointment no longer exists',
        404,
      ),
    );
  // 4) Check if appointment is already cancelled
  // 5) Check if appointment is already completed
  if (['cancelled', 'completed'].includes(appointment.status))
    return next(
      new AppError(`Appointment is already ${appointment.status}`, 400),
    );

  // 6) Check if appointment is confirmed or pending
  if (appointment.status === 'confirmed') {
    // a) check if it is <= 24 hours before the appointment time
    const timeRemaining = appointment.appointmentDate.getTime() - Date.now();
    // const _24HoursInMillis = 24 * 60 * 60 * 1000;
    console.log(appointment.appointmentDate, new Date(Date.now()));
    if (timeRemaining < 24 * 60 * 60 * 1000)
      return next(
        new AppError(
          'Appointments can only be cancelled 24 hours in advance',
          400,
        ),
      );
  }
  // b) Allow cancellation
  // b.1) Trigger refund

  if (!appointment.paymentIntent)
    return next(new AppError('Missing payment intent.', 404));

  try {
    const refund = await stripe.refunds.create({
      payment_intent: appointment.paymentIntent,
    });

    if (refund.status !== 'succeeded')
      return next(
        new AppError('Refund process failed. Please try again later', 502),
      );
  } catch (err) {
    console.error('❌ Stripe refund failed:', err.message);
    return next(
      new AppError(
        'We were unable to process your refund at this time. Please contact support.',
        502,
      ),
    );
  }
  // b.2) Notify doctors and patients via email

  try {
    await Promise.all([
      (email({
        to: patient.email,
        subject: 'Appointment payment refund ',
        message: `Hello ${patient.fullName}. Your request for payment refund has been initiated successfully. It might take few days for the refund process to complete.`,
      }),
      email({
        to: doctor.email,
        subject: `Patient requested appointment cancellation`,
        message: `Hello Dr. ${doctor.fullName}. ${patient.fullName} requested to cancel the appointment on ${appointment.appointmentDate} at ${appointment.appointmentSchedule.hours.from} to ${appointment.appointmentSchedule.hours.to}. The request is accepted and a full refund is initiated successfully`,
      })),
    ]);
  } catch (err) {
    console.error('⚠️ Email dispatch failed:', err.message);
  }
  // b.3) Mark booked slot as available
  // when the appointment status is updated to cancelled the booked slot will be available automatically

  // b.4) Update appointment status to 'cancelled' in DB

  try {
    appointment.status = 'cancelled';
    await appointment.save();
  } catch (err) {
    console.error('Appointment update failed', err.message);

    return next(
      new AppError(
        'Internal error. Appointment could not be updated at this time',
        500,
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Your appointment has been successfully cancelled and refunded',
  });
});
