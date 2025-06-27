module.exports = ({ userName, resetUrl }) => {
  const primaryColor = '#005a6f';
  const currentYear = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Password Reset Request</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 0 12px rgba(0,0,0,0.1);
            padding: 2rem;
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 1rem;
          }
          .header img {
            width: 120px;
            margin-bottom: 10px;
          }
          .content {
            padding-top: 1rem;
            text-align: center;
          }
          .content h2 {
            color: ${primaryColor};
          }
          .content p {
            margin: 1rem 0;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background-color: ${primaryColor};
            color: white;
            text-decoration: none;
            padding: 0.75rem 1.5rem;
            margin-top: 20px;
            border-radius: 5px;
            font-weight: 600;
            letter-spacing: 1px;
          }
          .footer {
            text-align: center;
            margin-top: 2rem;
            font-size: 0.8rem;
            color: #888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo.png" alt="DocPatient Nexus Logo" 
            onerror="this.onerror=null; this.src='/img/broken-image.png';"/>
          </div>
          <div class="content">
            <h2>Password Reset Request</h2>
            <p>Hi <strong>${userName}</strong>,</p>
            <p>We received a request to reset your password. If you didn’t request this, you can safely ignore this email.</p>
            <p>Otherwise, click the button below to set a new password. This link will expire in <strong>10 minutes</strong>.</p>
            <div style="word-wrap: break-word; width: 100%; overflow-wrap: break-word">Reset Password : ${resetUrl}</div>
          </div>
          <div class="footer">
            &copy; ${currentYear} DocPatient Nexus · All rights reserved
          </div>
        </div>
      </body>
    </html>
    `;
};
