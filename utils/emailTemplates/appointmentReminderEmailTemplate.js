module.exports = ({
  userName,
  role, // 'patient' or 'doctor'
  appointmentDate,
  timeRange,
  doctorName,
  patientName,
  appointmentId,
}) => {
  const primaryColor = '#005a6f';
  const currentYear = new Date().getFullYear();

  const greeting = `Hi <strong>${userName}</strong>,`;

  const roleSpecificMessage = {
    patient: `This is a friendly reminder for your upcoming appointment with <strong>Dr. ${doctorName}</strong>.`,
    doctor: `This is a reminder that you have an upcoming appointment with patient <strong>${patientName}</strong>.`,
  };

  const appointmentInfo = {
    patientLabel: 'Patient',
    doctorLabel: 'Doctor',
    doctorDisplay: `Dr. ${doctorName}`,
    patientDisplay: patientName,
  };

  const appointmentUrl = `https://docpatient-nexus.onrender.com`;

  return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Appointment Reminder</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
            body {
              font-family: 'Poppins', sans-serif;
              background-color: #f4f6f8;
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
              border-bottom: 1px solid #eee;
              padding-bottom: 1rem;
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
              background-color: #e8f6f9;
              border: 1px solid ${primaryColor};
              border-radius: 8px;
              padding: 1rem;
              margin-top: 1.5rem;
              text-align: left;
            }
            .info-box p {
              margin: 0.5rem 0;
            }
            .button {
              display: inline-block;
              background-color: ${primaryColor};
              color: white !important;
              padding: 12px 20px;
              margin-top: 20px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: 400;
              letter-spacing: 2px;
              font-size: 0.9rem;
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
              <img src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo.png" alt="DocPatient Nexus Logo" onerror="this.onerror=null; this.src='/img/broken-image.png';"/>
              
            </div>
            <div class="content">
              <h2>Appointment Reminder</h2>
              <p>${greeting}</p>
              <p>${roleSpecificMessage[role]}</p>
              <div class="info-box">
                <p><strong>📅 Date:</strong> ${appointmentDate}</p>
                <p><strong>⏰ Time:</strong> ${timeRange}</p>
                <p><strong>😷 ${
                  appointmentInfo.patientLabel
                }:</strong> ${appointmentInfo.patientDisplay}</p>
                <p><strong>🥼 ${
                  appointmentInfo.doctorLabel
                }:</strong> ${appointmentInfo.doctorDisplay}</p>
                <p><strong>🆔 Appointment ID:</strong> ${appointmentId}</p>
              </div>
              <a class="button" href="${appointmentUrl}" target="_blank">View Appointment</a>
            </div>
            <div class="footer">
              &copy; ${currentYear} DocPatient Nexus · All rights reserved
            </div>
          </div>
        </body>
      </html>
    `;
};
