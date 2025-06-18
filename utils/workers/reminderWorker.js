const { Worker } = require('bullmq');
const redis = require('../redisClient');
const sendEmail = require('../email');

const reminderWorker = new Worker(
  'medicationReminderQueue',
  async (job) => {
    const { to, subject, message } = job.data;
    if (!to || !subject || !message) {
      console.log('❌ Invalid job data:', job.data);
      throw new Error('Invalid email data. to, subject, message are required.');
    }
    try {
      console.log(`📤 Sending email to ${to}`);
      await sendEmail({ to, subject, message });
      console.log(`✅ Email sent to ${to}`);
    } catch (err) {
      console.error('Interneal error! Error sending email.');
    }
  },
  {
    connection: redis,
  },
);

reminderWorker.on('completed', () => console.log('✅ Job completed.'));

reminderWorker.on('failed', (job, error) =>
  console.log(`❌ Job ${job.id} failed. Reason: `, error.message),
);

reminderWorker.on('error', (error) =>
  console.error('❌ Worker error (connection or config issue):', error.message),
);

// pm2 start utils/workers/emailWorker.js --name email-worker
//
module.exports = reminderWorker;
