const medicationReminderQueue = require('../utils/queues/medicationReminderQueue');
const appointmentReminderQueue = require('../utils/queues/appointmentReminderQueue');

const scheduleMedicationReminder = ({ to, subject, message, html, sendAt }) => {
  if (!to || !subject || !message || !html || !sendAt) {
    console.warn('⚠ Missing required fields for medication reminder.');
    return;
  }

  const delay = sendAt instanceof Date ? sendAt.getTime() - Date.now() : sendAt;

  if (delay < 0) {
    console.warn('⚠ Cannot schedule past reminders. Skipping...');
    return;
  }
  medicationReminderQueue.add(
    'sendMedicationReminder',
    // Joba Data / Payload
    {
      to,
      subject,
      message,
      html,
    },

    // Job Options
    {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );
  console.log(
    `🔔 Medication reminder scheduled for ${to} in ${Math.floor(delay / 1000)} seconds.`,
  );
};

const scheduleAppointmentReminder = ({
  to,
  subject,
  message,
  html,
  sendAt,
}) => {
  if (!to || !subject || !message || !sendAt) {
    console.warn('⚠ Missing required fields for appointment reminder.');
    return;
  }
  const delay = sendAt instanceof Date ? sendAt.getTime() - Date.now() : sendAt;
  if (delay < 0) console.warn('⚠ Cannot schedule past reminders. Skipping...');

  appointmentReminderQueue.add(
    'sendAppointmentReminder', // Job name
    // Job data / payload
    {
      to,
      subject,
      message,
      html,
    },
    // Job options
    {
      delay,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    },
  );
  console.log(
    `🔔 Appointment reminder scheduled for ${to} in ${Math.floor(delay / 1000)} seconds.`,
  );
};

module.exports = { scheduleMedicationReminder, scheduleAppointmentReminder };
