// notificationService.js
const Notification = require('../models/notificationModel');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

const appointmentNotificationTemplate = require('../utils/emailTemplates/appointmentNotificationEmailTemplate');
const appointmentCancellationTemplate = require('../utils/emailTemplates/appointmentCancellationEmailTemplate');

// Models
// Admin, Doctor, Patient
const Models = { Admin, Doctor, Patient };
const sendNotification = async ({
  recipient,
  recipientModel,
  type,
  title,
  message,
  html,
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
    // create notification
    const notification = await Notification.create({
      recipient,
      recipientModel,
      type,
      title,
      message,
      metadata,
    });
    console.info(`✅ Notification stored for ${recipientModel} ${user._id}.`);
    // send appointment notification email
    await sendEmail({
      to: user.email,
      subject: title,
      message,
      html,
    });
    return notification;
  } catch (error) {
    console.error('❌ Failed to create notification:', error.message);
    throw new AppError('Internal error. Failed to create notification.', 500);
  }
};

const sendAppointmentNotification = async (appointment, doctor, patient) => {
  const date = `${new Date(appointment.appointmentDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )}`;
  const time = `${appointment.appointmentSchedule.hours.from}-${appointment.appointmentSchedule.hours.to}`;

  try {
    const html = appointmentNotificationTemplate({
      recipientName: patient.fullName,
      role: 'patient',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: patient._id,
      recipientModel: 'Patient',
      type: 'appointment',
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.fullName} on ${date} at ${time} is booked successfully`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
  try {
    const html = appointmentNotificationTemplate({
      recipientName: doctor.fullName,
      role: 'doctor',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: doctor._id,
      recipientModel: 'Doctor',
      type: 'appointment',
      title: 'New Appointment scheduled',
      message: `${patient.fullName} scheduled an appointment with you on ${date} at ${time}.`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
};

const sendAppointmentNotificationToManager = async (
  appointment,
  doctor,
  patient,
  appointmentManager,
) => {
  const date = `${new Date(appointment.appointmentDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )}`;
  const time = `${appointment.appointmentSchedule.hours.from}-${appointment.appointmentSchedule.hours.to}`;
  try {
    const html = appointmentNotificationTemplate({
      recipientName: appointmentManager.fullName,
      role: 'appointment-manager',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: appointmentManager._id,
      recipientModel: 'Admin',
      type: 'appointment',
      title: 'New Appointment Booked',
      message: `A new appointment has been booked. Please check the dashboard for more details.`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error(
      '❌ Failed to send an email to the appointment-manager:',
      err.message,
    );
  }
};

const sendAppointmentCancellationNotification = async (
  appointment,
  doctor,
  patient,
  appointmentManager,
) => {
  const date = `${new Date(appointment.appointmentDate).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  )}`;
  const time = `${appointment.appointmentSchedule.hours.from}-${appointment.appointmentSchedule.hours.to}`;

  try {
    const html = appointmentCancellationTemplate({
      userName: patient.fullName,
      role: 'patient',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: patient._id,
      recipientModel: 'Patient',
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Your appointment with Dr. ${doctor.fullName} on ${date} at ${time} is cancelled successfully.`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
  try {
    const html = appointmentCancellationTemplate({
      userName: doctor.fullName,
      role: 'doctor',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: doctor._id,
      recipientModel: 'Doctor',
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Your appointment with ${patient.fullName} on ${date} at ${time} is cancelled by the patient.`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
  try {
    const html = appointmentCancellationTemplate({
      userName: appointmentManager.fullName,
      role: 'appointment-manager',
      doctorName: doctor.fullName,
      patientName: patient.fullName,
      appointmentDate: date,
      timeRange: time,
      appointmentId: appointment._id,
    });
    await sendNotification({
      recipient: appointmentManager._id,
      recipientModel: 'Admin',
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `The appointment booked by ${patient.fullName} with Dr. ${doctor.fullName} on ${date} at ${time} is cancelled by the patient.`,
      html,
      metadata: {
        appointmentId: appointment._id,
      },
    });
  } catch (err) {
    console.error('❌ Failed to send an email to the patient:', err.message);
  }
};

module.exports = {
  sendAppointmentNotification,
  sendAppointmentNotificationToManager,
  sendAppointmentCancellationNotification,
};
