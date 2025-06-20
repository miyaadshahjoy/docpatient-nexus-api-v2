const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const testAccount = await nodemailer.createTestAccount();
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  // 2) Define the email options
  const emailOptions = {
    from: 'DocPatient Nexus" <no-reply@docpatientnexus.com>',
    to: options.to,
    subject: options.subject,
    message: options.message || '',
    html: options.html || null,
  };

  const info = await transporter.sendMail(emailOptions);
  console.log('📨 Message sent:', info.messageId);
  console.log('🔍 Preview URL:', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
