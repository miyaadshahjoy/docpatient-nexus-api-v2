const reminderQueue = require('../utils/queues/reminderQueue');

const scheduleMedicationReminder = ({ to, subject, message, sendAt }) => {
  if (!to || !subject || !message || !sendAt) {
    console.warn('⚠ Missing required fields for medication reminder.');
    return;
  }

  const delay = sendAt instanceof Date ? sendAt.getTime() - Date.now() : sendAt;
  if (delay < 0) {
    console.warn('⚠ Cannot schedule past reminders. Skipping...');
    return;
  }
  reminderQueue.add(
    'sendMedicationReminder',
    {
      to,
      subject,
      message,
    },
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
    `🎗 Reminder scheduled for ${to} in ${Math.floor(delay / 1000)} seconds.`,
  );
};

module.exports = scheduleMedicationReminder;
