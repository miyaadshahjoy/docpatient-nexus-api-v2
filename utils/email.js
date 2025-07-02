const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 2025,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
  });
  // 2) Define the email options
  const emailOptions = {
    from: 'DocPatient Nexus" <no-reply@docpatientnexus.com>',
    to: options.to,
    subject: options.subject,
    message: options.message || '',
    html: options.html || options.message,
  };

  const info = await transporter.sendMail(emailOptions);
  console.log('📨 Email sent', info.messageId);
};

module.exports = sendEmail;
