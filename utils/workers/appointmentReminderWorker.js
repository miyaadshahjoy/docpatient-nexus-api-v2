const { Worker } = require('bullmq');
const redis = require('../redisClient');
const sendEmail = require('../email');

const appointmentReminderWorker = new Worker(
  'appointmentReminderQueue',
  async (job) => {
    const { to, subject, message, html } = job.data;
    if (!to || !subject || !message) {
      console.log('❌ Invalid job data:', job.data);
      throw new Error('Invalid email data. to, subject, message are required.');
    }
    try {
      console.log('📤 Sending email to', to);
      sendEmail({ to, subject, message, html });
      console.log(` ✅Email sent to ${to}`);
    } catch (err) {
      console.error('Interneal error! Error sending email.');
    }
  },
  {
    connection: redis,
  },
);
appointmentReminderWorker.on('completed', () =>
  console.log('✅ Job completed.'),
);
appointmentReminderWorker.on('failed', () => console.log('❌ Job failed.'));

appointmentReminderWorker.on('error', (err) => {
  console.error('❌ Worker error (connection or config issue):', err.message);
});

module.exports = appointmentReminderWorker;
