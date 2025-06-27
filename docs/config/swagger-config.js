const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');
const superAdminDocs = require('../sources/routes/superAdminDocs');
const adminDocs = require('../sources/routes/adminDocs');
const doctorDocs = require('../sources/routes/doctorDocs');
const patientDocs = require('../sources/routes/patientDocs');
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
**DocPatient Nexus** is a modern, production-grade RESTful API that bridges the gap between patients and healthcare providers through an intelligent, role-aware appointment and health record management system. Built for **scalability**, **security**, and **developer experience**, it empowers hospitals, clinics, and digital health platforms to manage appointments, prescriptions, payments, and communication — all in one seamless backend.

At its core, the API supports real-time doctor availability tracking, dynamic patient scheduling, secure Stripe-powered payment processing, and notification workflows — all governed by **flexible Role + Identity-Based Access Control (RBAC + IBAC)**. 

Built with Node.js, Express, MongoDB, and Redis (BullMQ), this API is scalable, secure, and ready for production.

> <span>ℹ</span> <p>Whether you're integrating into a mobile health app, a clinic dashboard, or a telehealth SaaS platform, **DocPatient Nexus** serves as your backend workhorse—secure, performant, and dev-friendly</p>.


## 🧩 Key Features

- ✅ **Doctor Availability Scheduling** with conflict-aware time slot validation
- ✅ **Role + Identity-Based Access Control** (Admin, Appointment Manager, Doctor, Patient)
- ✅ **Appointment Lifecycle Management** (pending → confirmed → completed/canceled)
- ✅ **Stripe Payment Integration** with automated refund + status updates
- ✅ **Patient Prescription Management** with medication schedules & dosage tracking
- ✅ **Automated Reminders** for medications & upcoming appointments (via Email, SMS-ready, Queued with BullMQ)
- ✅ **Health Records System** – Store allergies, medical history, lab reports, and lifestyle data
- ✅ **Real-Time Notification Ready** – WebSocket-ready with DB-persisted notification model
- ✅ **Admin Dashboards** for monitoring appointments, payments, and patient activity
- ✅ **Secure & Performant**: JWT auth, HTTPS-ready, CORS-configured, validation at all layers

## 🛠️ Built With

- Node.js, Express.js, MongoDB, Mongoose
- Redis, BullMQ (for queues & reminders)
- Stripe (for secure payments)
- Modular, service-based architecture

## 🚀 Designed For

- 🏥 Clinics & Hospital Chains
- 🩺 Telemedicine Startups
- 📅 Appointment Scheduling Apps
- 🧩 Health SaaS Platforms
- 👩‍💻 Dev Teams needing a plug-and-play backend


## 🔒 Security & Scalability

- Built with secure authentication via JWT
- Scalable with Redis & worker-based task processing
- Future-proofed with real-time capabilities and modular service expansion


## 💬 Communication Channels

- 📧 Email Notifications (welcome, reminders, appointment updates)
- 💊 Medication Reminders (pre-scheduled via queue)
- 📞 SMS Notifications (pre-scheduled via queue)


**DocPatient Nexus** doesn’t just manage appointments — it **empowers digital healthcare**.   
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
        description:
          'Manages the full lifecycle of appointment booking,from creation and validation to confirmation, payment, cancellation, and completion. Includes patient-doctor slot validation, status transitions, and refund logic.',
      },
      {
        name: 'Prescriptions',
        description:
          'Endpoints to create and manage prescriptions issued by doctors. Links prescriptions to appointments, includes structured medication data, and supports automatic medication reminders via email or SMS.',
      },
      {
        name: 'Reviews',
        description: 'Operations related to reviews',
      },
      {
        name: 'Payments',
        description:
          'Stripe-powered secure payment infrastructure. Includes checkout session creation, webhook processing, and automatic updates to appointment payment statuses.',
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
  ...prescriptionDocs.paths,
  ...reviewDocs.paths,
  ...paymentDocs.paths, // Merging doctorDocs paths into swaggerSpec
};
module.exports = swaggerSpec;
