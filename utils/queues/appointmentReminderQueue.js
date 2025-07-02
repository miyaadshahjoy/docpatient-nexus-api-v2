const { Queue } = require('bullmq');
const redis = require('../redisClient');

const appointmentReminderQueue = new Queue('appointmentReminderQueue', {
  connection: redis,
});

module.exports = appointmentReminderQueue;
