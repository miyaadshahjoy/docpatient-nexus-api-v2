const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Appointment = require('../models/appointmentModel');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

const {
  sendAppointmentNotificationToManager,
} = require('../services/notificationService');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Create checkout session
exports.createCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked appointment
  const appointmentId = req.body.appointment;
  const appointment = await Appointment.findById(appointmentId);

  if (!appointment)
    return next(new AppError('No appointment is booked with this Id', 404));

  const doctor = await Doctor.findById(appointment.doctor);
  if (!doctor) return next(new AppError('No doctor exists with this Id', 404));
  if (appointment.status === 'cancelled' || appointment.status === 'completed')
    return next(
      new AppError(
        'This appointment has already been cancelled or completed',
        400,
      ),
    );

  if (appointment.paymentStatus === 'paid')
    return next(
      new AppError('This appointment has already been paid for', 400),
    );
  // 2) Create checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: req.user.email,
      client_reference_id: appointment._id.toString(),
      line_items: [
        {
          price_data: {
            currency: 'BDT',
            product_data: {
              name: `An appointment with ${doctor.fullName}`,
              images: [
                'https://t3.ftcdn.net/jpg/05/04/25/70/360_F_504257032_jBtwqNdvdMN9Xm6aDT0hcvtxDXPZErrn.jpg',
              ],
            },
            unit_amount: doctor.consultationFees * 100,
          },
          quantity: 1,
        },
      ],

      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}`,
      cancel_url: 'http://localhost:3000',

      // 3) Send session as response
    });
    res.status(201).json({
      status: 'success',
      message: 'Checkout session created successfully',
      data: {
        session,
      },
    });
  } catch (err) {
    console.error('❌ Failed to create checkout session:', err.message);
    return next(
      new AppError('Internal error. Failed to create checkout session', 500),
    );
  }
});

// Webhook handler
exports.stripeWebhookHandler = async (req, res, next) => {
  let event;
  try {
    // 1) Verify the stripe signature
    const signature = req.headers['stripe-signature'];
    // 2) Create Event
    event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);

    console.log(`🎉 Stripe event received. Event: ${event.type}`);
  } catch (err) {
    console.error('❌ Stripe signature verification failed:', err.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid stripe webhook signature',
    });
  }
  // 3) Handle the event -> checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const appointmentId = session.client_reference_id;

    console.log(`✅ Payment succeeded for appointment: ${appointmentId}`);

    // 4) Update the appointment
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        console.warn(`❌ No appointment found with Id: ${appointmentId}`);
        return res.status(404).json({
          status: 'fail',
          message: 'Appointment not found in the database.',
        });
      }
      appointment.paymentStatus = 'paid';
      appointment.paymentMethod = session.payment_method_types[0] || 'unknown';
      appointment.paymentIntent = session.payment_intent;
      await appointment.save();

      // Sending appointment-manager an email notification
      try {
        const appointmentManager = await Admin.findOne({
          roles: 'appointment-manager',
        });
        if (!appointmentManager)
          throw new Error('❌ No appointment manager found in the database.');

        // Sending email to the appointment manager
        const doctor = await Doctor.findById(appointment.doctor);
        if (!doctor)
          throw new Error(
            '❌ The doctor of this appointment no longer exists.',
          );
        const patient = await Patient.findById(appointment.patient);
        if (!patient)
          throw new Error(
            '❌ The patient who booked this appointment no longer exists.',
          );

        await sendAppointmentNotificationToManager(
          appointment,
          doctor,
          patient,
          appointmentManager,
        );
      } catch (err) {
        console.error(
          '❌ Failed to send appointment notification:',
          err.message,
        );
      }

      console.log(`🥳 Appointment updated successfully.`);
    } catch (err) {
      console.error(`❌ Failed to update appointment.`, err);
      return res.status(500).json({
        status: 'error',
        message: 'Internal error while updating the appointment status',
      });
    }
  }
  res.status(200).json({
    status: 'success',
    message: 'Webhook received and processed.',
  });
};
