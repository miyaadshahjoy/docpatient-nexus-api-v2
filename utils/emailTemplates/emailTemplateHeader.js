module.exports = () => {
  const primaryColor = '#005a6f';

  return `
      <!doctype html>
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Welcome to DocPatient Nexus</title>
              <style>
              @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
              body {
                  font-family: 'Poppins', sans-serif;
                  background-color: #f4f6f8;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  @media screen and (max-width: 600px) {
                  font-size: 63.5%;
                  }
              }
              .container {
                  max-width: 600px;
                  background: #ffffff;
                  margin: 40px auto;
                  padding-left: 1.5625rem;
                  padding-right: 1.5625rem;
                  border-radius: 5px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  color: white;
                  padding: 24px;
                  text-align: center;
                  border-bottom: #e8edf1 solid 1px;
              }
              .header__logo {
                  display: block;
                  height: 40px;
                  @media screen and (max-width: 600px) {
                  height: 17px;
                  }
              }
              .email-content {
                  padding: 1.875rem 1.25rem;
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  background-color: ${primaryColor};
                  color: white !important;
                  padding: 0.9375rem 1.875rem;
                  margin-top: 30px;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: 600;
                  font-size: 1rem;
                  font-weight: 400;
                  text-transform: uppercase;
                  letter-spacing: 1px;
              }
              .footer {
                  text-align: center;
                  padding: 0.9375rem;
                  font-size: 0.75rem;
              }
              </style>
          </head>
          <body>
              <div class="container">
              <div class="header">
                  <img
                  class="header__logo"
                  src="https://docpatient-nexus.onrender.com/img/docpatient-nexus-logo.png"
                  alt="DocPatient Nexus Logo"
                  onerror="this.onerror=null; this.src='https://docpatient-nexus.onrender.com/img/broken-image.png';"
                  />
                 
              </div>
              
         
      `;
};
