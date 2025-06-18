const { Queue } = require('bullmq');
const redis = require('../redisClient');

const reminderQueue = new Queue('medicationReminderQueue', {
  connection: redis,
});

module.exports = reminderQueue;
