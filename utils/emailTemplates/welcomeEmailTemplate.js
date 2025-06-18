// utils/emailTemplates/welcomeEmailTemplate.js

module.exports = ({ userName, emailVerificationLink }) => {
  const primaryColor = '#005a6f';
  const currentYear = new Date().getFullYear();

  console.log(__dirname);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to DocPatient Nexus</title>
      <style>
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f4f6f8;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          background: #ffffff;
          margin: 40px auto;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .header {
          background-color: ${primaryColor};
          color: white;
          padding: 24px;
          text-align: center;
        }
        .logo {
          display: block;
          max-width: 150px;
          margin: 0 auto 15px;
        }
        .content {
          padding: 30px 20px;
          text-align: center;
        }
        .button {
          display: inline-block;
          background-color: ${primaryColor};
          color: white !important;
          padding: 12px 24px;
          margin-top: 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          font-size: 16px;
        }
        .footer {
          background-color: #e8edf1;
          text-align: center;
          padding: 15px;
          font-size: 12px;
          color: #555;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img
            class="logo"
            src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo-white.png"
            alt="DocPatient Nexus Logo"
          />
          <h2>Welcome to DocPatient Nexus 👋</h2>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>We’re excited to have you join the future of healthcare!</p>
          <p>
            DocPatient Nexus helps you manage appointments, prescriptions,
            and health records in one place.
          </p>
          <p>To start using your account, please verify your email:</p>
  
          <a class="button" href="${emailVerificationLink}">Confirm Email</a>
  
          <p style="margin-top: 30px; font-size: 14px; color: #777;">
            If you didn’t sign up, just ignore this message.
          </p>
        </div>
        <div class="footer">
          &copy; ${currentYear} DocPatient Nexus. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `;
};
