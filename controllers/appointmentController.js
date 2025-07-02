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
const {
  sendAppointmentCancellationNotification,
} = require('../services/notificationService');
const Admin = require('../models/adminModel');

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
  // Check if the doctor exists in the DB
  const doctorId = req.params.id;
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));
  // attach the doctor to the request body
  req.body.doctor = doctor._id;

  // Check if the patient exists in the DB
  const patientId = req.user._id;
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient exists with this Id', 404));
  // attach the patient to the request body
  req.body.patient = patient._id;

  const date = req.body.appointmentDate;
  if (!date)
    return next(new AppError('Please provide an appointment date', 400));
  const dayOfWeek = req.body.appointmentSchedule.day;
  if (!dayOfWeek)
    return next(new AppError('Please provide an appointment day', 400));
  if (
    dayOfWeek.toLowerCase() !==
    DateTime.fromISO(date).toFormat('cccc').toLowerCase()
  )
    return next(
      new AppError('Please provide an appointment for the correct day', 400),
    );
  const availableSlots = await getAvailableSlots(doctor, date);

  const requestedSlot = req.body.appointmentSchedule;
  if (!requestedSlot?.hours?.from || !requestedSlot?.hours?.to) {
    return next(new AppError('Invalid appointment schedule provided', 400));
  }
  // Check if the requested time slot is available
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

  const requestedDate = new Date(date);

  requestedDate.setHours(
    ...requestedSlot.hours.from.split(':').map(Number),
    0,
    0,
  ),
    console.log(requestedDate, new Date());
  if (requestedDate.getTime() - Date.now() < 86400000)
    return next(
      new AppError('❌ You must book an appointment 24 hours in advance', 400),
    );
  // Book the appointment
  try {
    const appointment = await Appointment.create(req.body);

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
  if (!req.params.id)
    return next(new AppError('Please provide an appointment Id', 400));
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId);
  // 1) Check if the appointment exists with the provided id
  if (!appointment)
    return next(new AppError('No appointment found with the provided Id', 404));
  // 2) Check if the doctor exists in the DB
  const doctor = await Doctor.findById(appointment.doctor);
  if (!doctor)
    return next(
      new AppError(`The doctor of this appointment no longer exists.`, 404),
    );

  // 3) Check if the patient exists in the DB
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
    // a) check if it is <= 24 hours before the appointment time -> you have to cancel it 24 hours in advance
    const timeRemaining =
      new Date(appointment.appointmentDate).getTime() - Date.now();
    // const _24HoursInMillis = 24 * 60 * 60 * 1000;
    console.log(appointment.appointmentDate, new Date(Date.now()));
    if (timeRemaining < 24 * 60 * 60 * 1000)
      return next(
        new AppError(
          'Appointments can only be cancelled 24 hours in advance',
          400,
        ),
      );

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
  }
  // b.2) Notify doctors and patients via email

  try {
    const appointmentManager = await Admin.findOne({
      roles: 'appointment-manager',
    });
    if (!appointmentManager)
      throw new Error('❌ No appointment manager found in the database.');
    await sendAppointmentCancellationNotification(
      appointment,
      doctor,
      patient,
      appointmentManager,
    );
  } catch (err) {
    console.error(
      '⚠️ Email notification for cancellation failed: ',
      err.message,
    );
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
    message:
      'Your appointment has been successfully cancelled and refund is in the process',
  });
});
