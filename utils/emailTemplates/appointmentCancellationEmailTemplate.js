module.exports = ({
  userName,
  role,
  doctorName,
  patientName,
  appointmentDate,
  timeRange,
  appointmentId,
}) => {
  const primaryColor = '#d72638';
  const currentYear = new Date().getFullYear();

  const greeting = `Hi <strong>${userName}</strong>,`;

  const roleMessages = {
    patient: `Your appointment with <strong>Dr. ${doctorName}</strong> has been <span style="color: ${primaryColor}; font-weight: 600;">cancelled</span>.`,
    doctor: `The appointment with your patient <strong>${patientName}</strong> has been <span style="color: ${primaryColor}; font-weight: 600;">cancelled</span>.`,
    'appointment-manager': `An appointment between <strong>${patientName}</strong> and <strong>Dr. ${doctorName}</strong> has been <span style="color: ${primaryColor}; font-weight: 600;">cancelled</span>.`,
  };

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Appointment Cancelled</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            body {
              font-family: 'Poppins', sans-serif;
              background-color: #fdf2f2;
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
            }
            .header {
              text-align: center;
              padding-bottom: 1rem;
              border-bottom: 1px solid #eee;
            }
            .header img {
              width: 120px;
            }
            .content {
              text-align: center;
              padding-top: 1rem;
            }
            .content h2 {
              color: ${primaryColor};
            }
            .info-box {
              background-color: #ffe9e9;
              border: 1px solid ${primaryColor};
              border-radius: 8px;
              padding: 1rem;
              margin-top: 1.5rem;
              text-align: left;
            }
            .info-box p {
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
              <img src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo.png" alt="DocPatient Nexus Logo" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/4154/4154438.png';"/>
            </div>
            <div class="content">
              <h2>Appointment Cancelled</h2>
              <p>${greeting}</p>
              <p>${roleMessages[role]}</p>
              <div class="info-box">
                <p><strong>📅 Date:</strong> ${appointmentDate}</p>
                <p><strong>⏰ Time:</strong> ${timeRange}</p>
                <p><strong>👨‍⚕️ Doctor:</strong> Dr. ${doctorName}</p>
                <p><strong>🧑 Patient:</strong> ${patientName}</p>
                <p><strong>🆔 Appointment ID:</strong> ${appointmentId}</p>
              </div>
            </div>
            <div class="footer">
              &copy; ${currentYear} DocPatient Nexus · All rights reserved
            </div>
          </div>
        </body>
      </html>
    `;
};
