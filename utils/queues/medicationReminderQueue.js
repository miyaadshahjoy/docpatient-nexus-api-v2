const { Queue } = require('bullmq');
const redis = require('../redisClient');

const medicationReminderQueue = new Queue('medicationReminderQueue', {
  connection: redis,
});

module.exports = medicationReminderQueue;
