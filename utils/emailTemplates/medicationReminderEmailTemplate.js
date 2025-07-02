module.exports = ({ userName, medicationName, dosage, instruction, time }) => {
  const primaryColor = '#005a6f';
  const currentYear = new Date().getFullYear();

  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Medication Reminder</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
        body {
          font-family: 'Poppins', sans-serif;
          background-color: #f6f9fc;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 12px rgba(0,0,0,0.1);
          padding: 2rem;
          position: relative;
        }
        .open-browser {
          position: absolute;
          top: -40px;
          right: 0;
          font-size: 0.8rem;
          background: #005a6f;
          color: #fff;
          padding: 4px 8px;
          border-radius: 4px;
          text-decoration: none;
        }
        .header {
          text-align: center;
          border-bottom: 1px solid #eee;
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
        .pill-box {
          background-color: #e8f6f9;
          border: 1px solid ${primaryColor};
          border-radius: 8px;
          padding: 1rem;
          margin-top: 1.5rem;
          text-align: left;
        }
        .pill-box p {
          margin: 0.5rem 0;
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
          <img src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo.png" alt="DocPatient Nexus" onerror="this.onerror=null; this.src='/img/broken-image.png';"/>
          <h2>It's time to take your medication!</h2>
        </div>
        <div class="content">
          <p>Hi <strong>${userName}</strong>,</p>
          <p>This is a friendly reminder to take your medication as prescribed.</p>
          <div class="pill-box">
            <p><strong>🕒 Time:</strong> ${time}</p>
            <p><strong>💊 Medication:</strong> ${medicationName}</p>
            <p><strong>📏 Dosage:</strong> ${dosage}</p>
            <p><strong>📝 Instruction:</strong> ${instruction || 'No specific instructions'}</p>
          </div>
          <p style="margin-top: 1.5rem;">Please do not skip your dose. Your health matters to us.</p>
        </div>
        <div class="footer">
          &copy; ${currentYear} DocPatient Nexus · All rights reserved
        </div>
      </div>
    </body>
  </html>
  `;
};
