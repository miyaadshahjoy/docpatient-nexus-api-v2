module.exports = () => {
  const currentYear = new Date().getFullYear();
  return `
            <div class="footer">
                &copy; ${currentYear} DocPatient Nexus. All rights reserved.
            </div>
            </div>
        </body>
        </html>
    `;
};
