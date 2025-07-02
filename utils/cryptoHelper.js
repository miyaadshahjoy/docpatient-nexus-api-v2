const {
  scryptSync,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} = require('node:crypto');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const algorithm = 'aes-192-cbc';

const key = scryptSync(process.env.CRYPTO_SECRET_KEY, 'salt', 24);
const iv = randomBytes(16);

const encrypt = (plainText) => {
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, 'utf-8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (encryptedText) => {
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');
  return decrypted;
};

module.exports = { encrypt, decrypt };
