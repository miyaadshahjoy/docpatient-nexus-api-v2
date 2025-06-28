const header = require('./emailTemplateHeader');
const footer = require('./emailTemplateFooter');

module.exports = ({ userName, emailVerificationUrl }) => `
            ${header()}
            <div class="email-content">
                <img
                src="https://docpatient-nexus.onrender.com/img/welcome.svg"
                alt="WELCOME IMAGE"
                onerror="this.onerror=null; this.src='https://docpatient-nexus.onrender.com/img/broken-image.png';"
                style="width: 100%"
                />
                <h1>Welcome to DocPatient Nexus</h1>
                <p>
                Hi <strong>${userName}</strong>, we’re excited to have you join the
                future of healthcare! DocPatient Nexus helps you manage appointments,
                prescriptions, and health records in one place. To start using your
                account, please verify your email:
                </p>

                <a class="button" href="${emailVerificationUrl}">Confirm Email</a>
            </div>
            ${footer()}
    `;
