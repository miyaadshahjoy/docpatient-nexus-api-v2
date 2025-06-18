const dotenv = require('dotenv');
const { Redis } = require('ioredis');

dotenv.config({ path: './config.env' });

if (
  !process.env.REDIS_HOST ||
  !process.env.REDIS_PORT ||
  !process.env.REDIS_USERNAME ||
  !process.env.REDIS_PASSWORD
)
  throw new Error('Missing Redis environment variables');

const redis = new Redis({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,

  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redis.on('connect', () => console.log('✅ Connected to Redis!'));

redis.on('error', (err) => console.error('❌ Error connecting to Redis.', err));

module.exports = redis;
