const { Worker } = require('bullmq');
const redis = require('../redisClient');
const sendEmail = require('../email');

const medicationReminderWorker = new Worker(
  'medicationReminderQueue', // Queue name
  async (job) => {
    // Job handler
    const { to, subject, message, html } = job.data;
    if (!to || !subject || !message || !html) {
      console.log('❌ Invalid job data:', job.data);
      throw new Error('Invalid email data. to, subject, message are required.');
    }
    try {
      console.log(`📤 Sending email to ${to}`);

      await sendEmail({ to, subject, message, html });
      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error('Interneal error! Error sending email.', err);
    }
  },
  // Redis connection
  {
    connection: redis,
  },
);

medicationReminderWorker.on('completed', () =>
  console.log('✅ Job completed.'),
);

medicationReminderWorker.on('failed', (job, error) =>
  console.log(`❌ Job ${job.id} failed. Reason: `, error.message),
);

medicationReminderWorker.on('error', (error) =>
  console.error('❌ Worker error (connection or config issue):', error.message),
);

// pm2 start utils/workers/emailWorker.js --name email-worker
//
module.exports = medicationReminderWorker;
