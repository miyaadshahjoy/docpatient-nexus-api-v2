const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const superAdminDocs = require('../sources/routes/superAdminDocs');
const adminDocs = require('../sources/routes/adminDocs');
const doctorDocs = require('../sources/routes/doctorDocs');
const patientDocs = require('../sources/routes/patientDocs');
const appointmentDocs = require('../sources/routes/appointmentDocs');
const prescriptionDocs = require('../sources/routes/prescriptionDocs');
const reviewDocs = require('../sources/routes/reviewDocs');
const paymentDocs = require('../sources/routes/paymentDocs');

const schemas = require('../sources/components/schemas');
const responses = require('../sources/components/responses');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DocPatient Nexus API',
      version: '2.0.0',
      description: `
**DocPatient Nexus** is a modern, scalable, and secure REST API that bridges the gap between patients and healthcare providers through an intelligent, role-based medical appointment management system. Whether you're running a clinic, a telehealth startup, or a full-blown hospital system, this backend is designed to scale with your needs.

---

## 🚀 Features

### 🛡 Authentication & Authorization

- Secure **JWT-based** authentication
  - Use of JSON Web Tokens (JWT) to implement stateless authentication across all user roles (Patients, Doctors, Admins, Super Admins)
  - JWT generation after a successful login and signing with a secure server-side secret
  - JWT invalidation on logout
  - Token includes:
    - **id**: User ID
    - **role**: Access control role
    - **iat, exp**: Issued-at and expiration timestamps
  - All protected routes requiring a valid *Authorization: Bearer(token)* header.
  - Custom middleware (authController.protect) verifying token integrity, expiration, and user existence.
  - Role-based access control via restrictTo(...) middleware enforces granular permissions (e.g. only Doctors can prescribe).
  - Sub-role support for admins (e.g. ['admin', 'appointment-manager']) adds fine-grained authorization control.
  - JWT token revokation on user password change using the passwordChangedAt field.
- Role-based access control: *super-admin*, *admin*, *doctor*, *patient*
- Identity-based access enforcement
- Email verification with expiration
- Password hashing, reset, and update
- Account status checks: active, pending, removed

### 📅 Appointment Management

- Smart Doctor availability scheduling
- Dynamic visiting hours slot creation and validation for each Doctor
- Appointment booking and cancellation with proper validation
- Appointment approval and rejection by Admin
- Appointment approval after payment
- Appointment lifecycle: *pending → confirmed → completed/cancelled*
- Stripe-powered secure payments
- Refund logic for cancellations
- Follow-up appointment creation after completed appointment or missed appointment
- Availability change after appointment booking and cancellation
- Email notification for appointment booking and cancellation
- Appointment reminder email for both Doctor and Patient

### 💊 Prescriptions & Medications

- Prescriptions linked to appointments
- Prescription creation by Doctors on approved or completed appointments only
- Prescription allowed to have multiple medications
- Prescription status: *active*, *expired*, *deleted*
- Medication includes name, dosage, frequency, duration, and instructions
- Medication reminder email for Patient

### 🧾 Patient Medical Records

- Unified record per patient
- Tracks allergies, conditions, surgeries, lifestyle, family history
- Support for uploading and storing lab reports

### 💳 Payments

- Stripe Checkout Session integration
- Payment tracking (*paid*, *unpaid*)
- Webhook verification for secure payment updates
- Refund logic for cancellations
- Email notification for payment confirmation
- Email notification for payment failure

### ⭐ Doctor Reviews

- Patients can leave reviews for completed appointments
- Single review per appointment
- Average doctor rating calculation on each review submission
- Review update support with validation

### 📬 Notification System

- Reusable *Notification* model
- Types: *appointment*, *reminder*, *system*, *custom*, *medication*
- Job scheduling for appointment and medication reminders via email
- BullMQ queues with Redis for background job scheduling
- Redis for in-memory store for BullMQ queue and job management (for real-time notification)
- Real-time notification-ready (Socket.IO friendly)

### 📧 Email Notifications

- Email templates for:
  - Welcome + Email Verification
  - Password Reset
  - Appointment Confirmation/Cancellation
  - Appointment & Medication Reminders
- Dynamic branding with HTML & CSS

---

## 🎯 What It Solves

### ✅ Real-World Problems Solved by DocPatient Nexus API

1. **⏰ Appointment Chaos → Organized Scheduling**

   - No more overbooked time slots, double bookings, or unclear availability.
   - Patients can only book from validated, doctor-defined visiting hours.
   - Real-time conflict detection ensures accurate appointment slots.

2. **📞 Endless Calls → Self-Service Booking**

   - Patients don't need to call the clinic to book, cancel, or confirm appointments.
   - Everything is handled via secure API endpoints, ready for any frontend (mobile/web).

3. **😵 Medication Confusion → Smart Reminders**

   - Automatically schedules personalized medication reminders via email.
   - Sends reminders **10 minutes** before each dose, helping patients stick to treatment plans.

4. **💳 Manual Billing → Seamless Online Payments**

   - Secure Stripe integration for paying doctor fees online.
   - Handles automatic receipt generation, status tracking, and error handling.

5. **📁 Scattered Health Records → Centralized Patient Records**

   - Stores all patient-related data in one place: prescriptions, lab reports, surgeries, allergies, etc.
   - Easily accessible to Doctors, Patients, and authorized Admins.

6. **🧾 Forgotten Reviews → Verified Feedback System**

   - Ensures Patients can only leave reviews **after completing an appointment**.
   - Helps clinics gather authentic feedback to improve services.

7. **📬 Silent System → Role-Based Notifications**

   - Doctors, Patients, and appointment-managers receive **context-specific notifications** via email (soon SMS + in-app).
   - Tracks events like appointment creation, cancellation, payment, and prescription updates.

8. **✅ Limited Access Control → Multi-Level Admin System**

   - Fine-grained role & sub-role access: Super Admin, Admin, Appointment Manager, etc.
   - Prevents unauthorized actions and keeps data secure and organized.

9. **📄 Manual Emailing → Automated Communication**

   - Sends beautiful, production-grade email templates for:

     - Welcome emails
     - Email verification
     - Appointment booking and cancellation
     - Appointment reminders (Doctor & Patient)
     - Medication reminders (Patient)
     - Password resets
     - Payment confirmation
     - Payment failure
     - Review submission
     - System notifications

10. **🥼 Doctor’s Visibility → Review-Based Reputation**

    - Calculates Doctor's average rating based on Patient reviews.
    - Builds trust for Patients selecting a provider.

11. **⚖️ Mismanaged Cancellations → Smart Refund Workflow**

    - Handles appointment cancellations with refund eligibility logic baked in.
    - Reduces admin overhead and improves transparency.

---

## 📦 Designed For

- 🏥 **Clinics & Hospitals**
- 💻 **Telemedicine Startups**
- 📱 **Health Apps / Patient Portals**
- 🏥 **Hospital Management Systems**
- 💻 **SaaS Backend Integrations**
- 🧩 **Developers building medical platforms**

---

## 🛠️ Tech Stack & Tools
<table>
  <tr>
    <th>Technology</th>
    <th>Usage/Purpose</th>
  </tr>
  <tr>
    <td>Node.js</td>
    <td>JavaScript runtime for the backend server</td>
  </tr>
  <tr>
    <td>Express.js</td>
    <td>Web framework for REST APIs</td>
  </tr>
  <tr>
    <td>MongoDB</td>
    <td>NoSQL database for scalable data storage</td>
  </tr>
  <tr>
    <td>Mongoose</td>
    <td>ODM for MongoDB, schema validation, population</td>
  </tr>
  <tr>
    <td>npm</td>
    <td>Package manager for Node.js</td>
  </tr>
  <tr>
    <td>dotenv</td>
    <td>Environment variable management</td>
  </tr>
  <tr>
    <td>JWT</td>
    <td>Authentication & access control</td>
  </tr>
  <tr>
    <td>bcrypt</td>
    <td>Secure password hashing</td>
  </tr>
  <tr>
    <td>crypto</td>
    <td>Encryption and decryption of sensitive data</td>
  </tr>
  <tr>
    <td>multer</td>
    <td>Multi-part/form-data file uploads</td>
  </tr>
  <tr>
    <td>BullMQ</td>
    <td>Queue system for background jobs & reminders</td>
  </tr>
  <tr>
    <td>Redis</td>
    <td>In-memory store for BullMQ</td>
  </tr>
  <tr>
    <td>Stripe</td>
    <td>Payment processing & webhook handling</td>
  </tr>
  <tr>
    <td>Nodemailer</td>
    <td>Sending transactional emails</td>
  </tr>
  <tr>
    <td>mailpit</td>
    <td>Email testing and debugging in local dev</td>
  </tr>
  <tr>
    <td>mailtrap</td>
    <td>Email testing and debugging in production</td>
  </tr>
  <tr>
    <td>Swagger(JS Doc)</td>
    <td>API documentation </td>
  </tr>
  <tr>
    <td>CORS</td>
    <td>Cross-Origin Resource Sharing setup</td>
  </tr>
  <tr>
    <td>Postmant</td>
    <td>API testing and debugging</td>
  </tr>
</table>

---

### 📬 Mailpit Setup for Local Email Testing

This project uses *Mailpit* for local email testing. Mailpit is a lightweight SMTP server and web interface that lets you capture and view emails sent from this API.

#### ✅ Features:

- No real emails are sent
- View all outgoing emails in a web interface
- Works seamlessly with nodemailer or any mail library

- [Mailpit GitHub Repository](https://github.com/axllent/mailpit)
- [Mailpit Documentation](https://mailpit.axllent.org/docs/install/)

#### 🔧 Installation

##### Option 1: Install via Binary

- Download from the [Mailpit releases page](https://github.com/axllent/mailpit/releases)

  - **For Windows:** download [mailpit-windows-amd64.exe](https://github.com/axllent/mailpit/releases/download/v1.27.0/mailpit-windows-amd64.zip)
  - **For macOS:** download and install using Homebrew:<br><br><code>brew install --no-quarantine --cask mailpit</code><br>

  - **For Linux:**<br><br><code>
curl -s https://api.github.com/repos/axllent/mailpit/releases/latest grep browser_download_url grep linux-amd64 cut -d '"' -f 4 wget -qi -<br>
tar -xzf mailpit-*-linux-amd64.tar.gz<br>
sudo mv mailpit /usr/local/bin/</code><br>
  
##### Option 2: Run via Docker<br><br><code>docker run -d --name mailpit -p 8025:8025 -p 2025:2025 axllent/mailpit</code><br>


#### 🚀 Usage

- **🖥 For Windows:**<br><br><code>
cd C:\Users\<username>\Downloads\mailpit-windows-amd64<br>
.\mailpit.exe --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025</code><br>


- **🍎 For macOS:**<br><br><code>
sudo mv mailpit-darwin-arm64 /usr/local/bin/mailpit<br>
mailpit --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025</code><br>


- **🐧 For Linux:**<br><br><code>
sudo mv mailpit-linux-amd64 /usr/local/bin/mailpit<br>
mailpit --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025</code><br>


- **🐳 For Docker:**<br><br><code>
docker run --rm -p 8025:8025 -p 2025:2025 axllent/mailpit --smtp 0.0.0.0:2025 --listen 0.0.0.0:8025</code><br>


#### 🔍 View Emails

- SMTP available at: http://localhost:2025
- Web UI: http://localhost:8025 (This is Mailpit's web UI where you can view, read, and inspect all outgoing emails.)

---

### 🛢 Redis setup for BullMQ

- Redis (Remote Dictionary Server) is a fast, open-source, in-memory key-value data store that's often used as a database, cache, and message broker.
- Redis is used as a queue for sending email notifications and reminders in this application.
- This project uses **BullMQ** for job scheduling and background processing, which requires a **Redis** server to function.
- Go to [https://cloud.redis.io/#/databases](https://cloud.redis.io/#/databases) to create a free Redis database.
- Install Redis<br>
<code>npm install ioredis</code>

- Configure Redis connection in your **.env** file:<br>
<code>
REDIS_HOST=YOUR_REDIS_HOST <br>
REDIS_PORT=YOUR_REDIS_PORT <br>
REDIS_USERNAME=YOUR_REDIS_USERNAME (default: default) <br>
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
</code>

- Create a Redis client in your application:
  <pre> 
    const { Redis } = require('ioredis');
    const redisClient = new Redis({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });
  </pre>

- Go to the [Redis documentation](https://redis.io/documentation) for more information on how to set up and use Redis.


---


## 📚 Current Modules

- Authentication & Authorization
- Admin Interfaces (Super Admin, Admin)
- Doctor Management (CRUD + Scheduling + Availability)
- Patient Management (CRUD)
- Appointment Booking & Management (CRUD)
- Payment Integration (Checkout Sessions + Webhooks)
- Prescriptions & Medications (CRUD)
- Patient Medical Records (CRUD)
- Reviews (CRUD)
- Notifications (CRUD)
- Email Notifications
- Appointment Reminders (Email)
- Medication Reminders (Email)

---

## 🧩 Upcoming Features

- [ ] ✅ Real-time chat system between Doctor and Patient (private & secure)
- [ ] ✅ Push notifications (SMS, in-app)
- [ ] ✅ AI-based smart time recommendations for Patients
- [ ] ✅ Analytics dashboard for Admins
- [ ] ✅ Downloadable invoices & appointment receipts

---

## 🏥 DocPatient Nexus

Making healthcare scheduling simpler, faster and smarter.
`,
      contact: {
        name: 'Miyaad Shah Joy',
        email: 'docpatientnexus@example.com',
      },
    },
    servers: [
      {
        url: 'https://docpatient-nexus.onrender.com',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas,
      responses,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },

    tags: [
      {
        name: 'Super-Admins',
        description:
          'Endpoints that give full control over the system. Super-Admins can manage all users, assign admin roles, configure global settings, and ensure operational oversight. Reserved for the highest-level access in the system.',
      },
      {
        name: 'Admins',
        description: `
Admin endpoints empower healthcare operations staff—such as clinic managers, hospital administrators, and support-teams to manage and monitor the DocPatient Nexus system. Admins have elevated privileges but are scoped to specific operational roles, such as:

- Managing doctor and patient accounts (view, edit, delete, activate/deactivate)  
- Monitoring and updating appointment statuses (pending, confirmed, canceled, completed)  
- Accessing dashboards to view key performance indicators like total bookings, revenue, or doctor utilization  
- Sending notifications to users (doctors or patients) in cases of rescheduling, cancellations, or critical updates  
- Assigning sub-roles such as *appointment-manager*, *doctor-manager*, or *patient-manager* for scoped responsibilities  
- Overseeing payment processing flows and refund management

Admin access is role-based and identity-aware, allowing fine-grained permission control and operational accountability. These routes are secured via JWT authentication and protected with middleware that ensures only authorized admins can access specific functionality.
`,
      },
      {
        name: 'Doctors',
        description: `
Endpoints for Doctors to manage their availability, appointments, and patient interactions. 

Authenticated doctors can:

• Manage their public profile (name, specialization, consultation fees, location)  
• Set and update available visiting hours for appointment scheduling  
• View their upcoming, ongoing, and completed appointments  
• Access prescriptions they've written and patient medical history (if authorized)  
• Write and update prescriptions for completed appointments  
• Receive notifications about new bookings, cancellations, or updates from patients or admins  
• Track their patient list and health records where permitted

These routes ensure that doctors are only exposed to patient data they're authorized to view, based on appointment relationships and verification status. All endpoints are protected via *JWT* tokens and role-based access control (*role: doctor*).        
`,
      },
      {
        name: 'Patients',
        description: `
Patient endpoints enable users to book, manage, and track appointments, access prescriptions, and maintain their health records.

Logged-in patients can:
 
• View detailed doctor profiles including consultation fees and ratings  
• Book appointments with dynamic slot validation and conflict prevention  
• Pay for appointments securely using Stripe (with refund/cancellation support)  
• View and download prescriptions from completed appointments  
• Manage their personal health record including allergies, conditions, and past surgeries  
• Receive email reminders for medication, appointment confirmations, and follow-ups

Patients are authenticated using *JWT* tokens and protected routes ensure that users only access their own data. Patient operations are designed to streamline the care journey and improve medication and appointment adherence.        
`,
      },
      {
        name: 'Appointments',
        description: `
Endpoints for managing the full lifecycle of medical appointments between doctors and patients.

These routes enable:

• Patients to view doctor's available time slots and book appointments  
• Doctors to manage availability and view upcoming consultations  
• Admins to oversee, update, or cancel appointments as needed  
• Appointment status transitions from "pending" → "confirmed" → "completed" or "cancelled"  
• Integration with Stripe for secure online payments and refund processing  
• Automatic email/SMS notifications for key actions (bookings, cancellations, reminders)

The appointment module is role-aware, enforcing permissions and access based on user type (patient, doctor, admin). It also supports refund logic, confirmation flows, and appointment analytics for clinic staff. 
`,
      },
      {
        name: 'Prescriptions',
        description: `
Endpoints for creating, retrieving, and managing prescriptions generated by doctors after a consultation.

These endpoints allow:

• Doctors to issue new prescriptions for completed appointments  
• Patients to access their prescribed medications, dosage, and instructions  
• Admins (if authorized) to audit prescriptions for compliance   
• Optional linking of prescriptions to patient records for full health tracking

Each prescription includes detailed medication schemas (name, dosage, frequency, duration, instructions), and can trigger automatic email/SMS reminders to improve medication adherence.
`,
      },
      {
        name: 'Reviews',
        description: `
Routes for managing patient-submitted reviews and ratings for doctors after a completed appointment.

These endpoints allow:

• Patients to leave a review and star rating after a completed appointment  
• Doctors to receive feedback on their care and consultation experience  
• The system to auto-update the doctor's average rating and review count  
• Retrieval of all reviews for a doctor (public access, for profiles)  
• Patients to fetch their own reviews for recordkeeping or editing (if allowed)

Review creation is tightly scoped to completed appointments, ensuring only legitimate, verified patient-doctor interactions are rated. Reviews contribute to the doctor's public profile and help other patients make informed booking decisions.
`,
      },
      {
        name: 'Payments',
        description: `
Endpoints for handling secure payment processing related to medical appointments.

This module enables:

• Patients to initiate payment via Stripe Checkout for confirmed appointments  
• Real-time creation of Stripe sessions with appointment and doctor fee details  
• Webhook support for Stripe to confirm payment success and update appointment status  
• Automatic notifications to patients, doctors, and appointment managers after payment  
• Built-in support for refunds and cancellations based on business logic  
• Future extensibility for payment history, receipts, and billing analytics

Payments are fully integrated with the appointment lifecycle and adhere to Stripe's secure infrastructure. Sensitive financial data is never stored, and all interactions are validated with webhooks and signature verification.
`,
      },
    ],
  },
  apis: [
    path.join(__dirname, './components/*.js'),
    path.join(__dirname, './routes/*.js'),
  ],
};

const swaggerSpec = swaggerJsDoc(options);
swaggerSpec.paths = {
  ...swaggerSpec.paths,
  ...superAdminDocs.paths,
  ...adminDocs.paths,
  ...doctorDocs.paths,
  ...patientDocs.paths,
  ...appointmentDocs.paths,
  ...prescriptionDocs.paths,
  ...reviewDocs.paths,
  ...paymentDocs.paths,
};
module.exports = swaggerSpec;
