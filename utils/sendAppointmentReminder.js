const { scheduleAppointmentReminder } = require('../services/reminderService');
const appointmentReminderTemplate = require('./emailTemplates/appointmentReminderEmailTemplate');

module.exports = (appointment, doctor, patient) => {
  // Set reminder for appointment
  const date = new Date(appointment.appointmentDate).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  );
  const time = `${appointment.appointmentSchedule.hours.from}-${appointment.appointmentSchedule.hours.to}`;
  // html for patient email
  const htmlPaitentEmail = appointmentReminderTemplate({
    userName: patient.fullName,
    role: 'patient', // 'patient' or 'doctor'
    appointmentDate: date,
    timeRange: time,
    doctorName: doctor.fullName,
    patientName: patient.fullName,
    appointmentId: appointment._id,
  });
  // html for doctor email
  const htmlDoctorEmail = appointmentReminderTemplate({
    userName: doctor.fullName,
    role: 'doctor', // 'patient' or 'doctor'
    appointmentDate: date,
    timeRange: time,
    doctorName: doctor.fullName,
    patientName: patient.fullName,
    appointmentId: appointment._id,
  });

  const reminderDateTime = new Date(appointment.appointmentDate);
  reminderDateTime.setHours(
    ...appointment.appointmentSchedule.hours.from.split(':').map(Number),
    0,
    0,
  );

  reminderDateTime.setHours(reminderDateTime.getHours() - 12);
  // reminder for patient
  scheduleAppointmentReminder({
    to: patient.email,
    subject: '🔔 Appointment Reminder',
    message: `You have an appointment with Dr. ${doctor.fullName} on ${date} at ${time}.`,
    html: htmlPaitentEmail,
    sendAt: reminderDateTime,
  });
  // reminder for doctor
  scheduleAppointmentReminder({
    to: doctor.email,
    subject: '🔔 Appointment Reminder',
    message: `You have an appointment with ${patient.fullName} on ${date} at ${time}.`,
    html: htmlDoctorEmail,
    sendAt: reminderDateTime,
  });
};
