// notificationService.js
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

// Models
// Admin, Doctor, Patient
const Models = { Admin, Doctor, Patient };
const sendNotification = async ({
  recipient,
  recipientModel,
  type,
  title,
  message,
  metadata = {},
}) => {
  if (!recipient || !recipientModel || !type || !title || !message)
    throw new AppError('Missing required notification fields.', 400);

  const userModel = Models[recipientModel];
  if (!userModel)
    throw new AppError(
      `Invalid recipient model provided: ${recipientModel}`,
      400,
    );
  const user = await userModel.findById(recipient);
  if (!user) throw new AppError('User not found.', 404);

  if (!user.email) throw new AppError('User does not have an email.', 400);
  try {
    const notification = await Notification.create({
      recipient,
      recipientModel,
      type,
      title,
      message,
      metadata,
    });
    console.info(`✅ Notification stored for ${recipientModel} ${user._id}.`);
    await sendEmail({
      to: user.email,
      subject: title,
      message,
    });
    return notification;
  } catch (error) {
    console.error('❌ Failed to create notification:', error.message);
    throw new AppError('Internal error. Failed to create notification.', 500);
  }
};

const sendAppointmentNotification = async (appointment, doctor, patient) => {
  const date = `${appointment.appointmentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`;
  const time = `${appointment.appointmentSchedule.hours.from}-${appointment.appointmentSchedule.hours.to}`;
  try {
    await sendNotification({
      recipient: patient._id,
      recipientModel: 'Patient',
      type: 'appointment',
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.fullName} on ${date} at ${time} is booked successfully`,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
  try {
    await sendNotification({
      recipient: doctor._id,
      recipientModel: 'Doctor',
      type: 'appointment',
      title: 'New Appointment scheduled',
      message: `${patient.fullName} scheduled an appointment with you on ${date} at ${time}.`,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
};

module.exports = { sendAppointmentNotification };
