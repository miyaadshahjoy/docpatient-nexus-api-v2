# 🩺 DocPatient Nexus API

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
  - All protected routes requiring a valid `Authorization: Bearer <token>` header.
  - Custom middleware (authController.protect) verifying token integrity, expiration, and user existence.
  - Role-based access control via restrictTo(...) middleware enforces granular permissions (e.g. only Doctors can prescribe).
  - Sub-role support for admins (e.g. ['admin', 'appointment-manager']) adds fine-grained authorization control.
  - JWT token revokation on user password change using the passwordChangedAt field.

- Role-based access control: `super-admin`, `admin`, `doctor`, `patient`
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
- Appointment lifecycle: `pending → confirmed → completed/cancelled`
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
- Prescription status: `active`, `expired`, `deleted`
- Medication includes name, dosage, frequency, duration, and instructions
- Medication reminder email for Patient

### 🧾 Patient Medical Records

- Unified record per patient
- Tracks allergies, conditions, surgeries, lifestyle, family history
- Support for uploading and storing lab reports

### 💳 Payments

- Stripe Checkout Session integration
- Payment tracking (`paid`, `unpaid`)
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

- Reusable `Notification` model
- Types: `appointment`, `reminder`, `system`, `custom`, `medication`
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

| Technology          | Usage/Purpose                                  |
| ------------------- | ---------------------------------------------- |
| **Node.js**         | JavaScript runtime for the backend server      |
| **Express.js**      | Web framework for REST APIs                    |
| **MongoDB**         | NoSQL database for scalable data storage       |
| **Mongoose**        | ODM for MongoDB, schema validation, population |
| **npm**             | Package manager for Node.js                    |
| **dotenv**          | Environment variable management                |
| **JWT**             | Authentication & access control                |
| **bcrypt**          | Secure password hashing                        |
| **crypto**          | Encryption and decryption of sensitive data    |
| **multer**          | Multi-part/form-data file uploads              |
| **BullMQ**          | Queue system for background jobs & reminders   |
| **Redis**           | In-memory store for BullMQ                     |
| **Stripe**          | Payment processing & webhook handling          |
| **Nodemailer**      | Sending transactional emails                   |
| **mailpit**         | Email testing and debugging                    |
| **Swagger (JSDoc)** | API documentation                              |
| **CORS**            | Cross-Origin Resource Sharing setup            |
| **Postman**         | API testing and debugging                      |

---

## 🔑 Data Models

![My SVG](https://github.com/miyaadshahjoy/docpatient-nexus-api-v2/blob/main/public/assets/Data%20Models/docPatient-nexus%20diagram%20-%20Model.svg)

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

## 📦 API Documentation

![image](https://github.com/user-attachments/assets/cec5d1ef-792a-4945-9f17-32171786b887)
![image](https://github.com/user-attachments/assets/f55b22c0-829a-48a5-ab0e-87fcdf6dd265)
![image](https://github.com/user-attachments/assets/c3524bb6-7516-44b0-9291-cb5ddceaa2bc)
![image](https://github.com/user-attachments/assets/4cb5d500-0a92-4896-9186-4c2c145f3bf3)

📖 API Docs available at:

- [https://docpatient-nexus.onrender.com/api/v2/docs/](https://docpatient-nexus.onrender.com/api/v2/docs/)
- The documentations are not complete. Stay tuned...✌🏻

---

## ⚙️ Project Setup

### 📦 Clone the repository

```bash
git clone https://github.com/miyaadshahjoy/docpatient-nexus-api-v2.git
cd docpatient-nexus-api-v2
npm install
npm run start
```

### 📦 Environment Variables

```bash
PORT=YOUR_PORT
DB_USERNAME=MONGODB_USERNAME
DB_PASSWORD=MONGODB_PASSWORD
DB_CONNECTION_STRING=MONGODB_CONNECTION_STRING (Example: mongodb+srv://<username>:<password>@cluster0.mongodb.net/docPatientNexus?retryWrites=true&w=majority&appName=Cluster0)
DB_LOCAL_CONNECTION_STRING=MONGODB_LOCAL_CONNECTION_STRING -> if you want to use local mongodb (Example: mongodb://localhost:27017/docPatientNexus)
JWT_SECRET_KEY=YOUR_JWT_SECRET_KEY (32 bytes encryption key)
JWT_EXPIRES_IN=EXPIRES_IN_IN_DAYS (example: 30d)
CRYPTO_SECRET_KEY=CRYPTO_SECRET_KEY (16 bytes encryption key)
FRONTEND_URL=FRONTEND_URL (example: https://docpatientnexus.com)
SUPER_ADMIN_EMAIL=super-admin@docpatientnexus.com
STRIPE_SECRET_KEY=YOUR_STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET=YOUR_STRIPE_WEBHOOK_SECRET (use stripe cli to generate webhook secret)
REDIS_USERNAME=YOUR_REDIS_USERNAME (default: default)
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=YOUR_REDIS_PORT

```

### 📬 Mailpit Setup for Local Email Testing

### This project uses `Mailpit` for local email testing. Mailpit is a lightweight SMTP server and web interface that lets you capture and view emails sent from this API.

### ✅ Features:

- No real emails are sent
- View all outgoing emails in a web interface
- Works seamlessly with nodemailer or any mail library

- [Mailpit GitHub Repository](https://github.com/axllent/mailpit)
- [Mailpit Documentation](https://mailpit.axllent.org/docs/install/)

### 🔧 Installation

#### Option 1: Install via Binary

- Download from the [Mailpit releases page](https://github.com/axllent/mailpit/releases)

  - **For Windows:** download [mailpit-windows-amd64.exe](https://github.com/axllent/mailpit/releases/download/v1.27.0/mailpit-windows-amd64.zip)
  - **For macOS:** download and install using Homebrew:

  ```bash
  brew install --no-quarantine --cask mailpit
  ```

  - **For Linux:**

  ```bash
  curl -s https://api.github.com/repos/axllent/mailpit/releases/latest \
  | grep browser_download_url \
  | grep linux-amd64 \
  | cut -d '"' -f 4 \
  | wget -qi -

  tar -xzf mailpit-\*-linux-amd64.tar.gz
  sudo mv mailpit /usr/local/bin/
  ```

#### Option 2: Run via Docker

```bash
docker run -d --name mailpit \
 -p 8025:8025 -p 2025:2025 \
 axllent/mailpit
```

### 🚀 Usage

- **🖥 For Windows:**

```bash
cd C:\Users\<username>\Downloads\mailpit-windows-amd64
.\mailpit.exe --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025
```

- **🍎 For macOS:**

```bash
sudo mv mailpit-darwin-arm64 /usr/local/bin/mailpit
mailpit --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025
```

- **🐧 For Linux:**

```bash
sudo mv mailpit-linux-amd64 /usr/local/bin/mailpit
mailpit --smtp 127.0.0.1:2025 --listen 127.0.0.1:8025
```

- **🐳 For Docker:**

```bash
docker run --rm -p 8025:8025 -p 2025:2025 axllent/mailpit \
  --smtp 0.0.0.0:2025 --listen 0.0.0.0:8025
```

### 🔍 View Emails

- SMTP available at: http://localhost:2025
- Web UI: http://localhost:8025 (This is Mailpit's web UI where you can view, read, and inspect all outgoing emails.)

---

## 📦 Project Structure

```bash
├── controllers
├── middlewares
├── models
├── routes
├── services
├── utils
├── public
├── docs
├── package.json
├── package-lock.json
├── README.md
├── .env
├── .gitignore
├── .prettierrc
├── .eslintrc
├── app.js
├── server.js

```

---

## 🙏 Contributing

Pull requests are welcome! Feel free to fork the repo, create a feature branch and submit a PR.

---

## 🧾 License

MIT © [Miyaad Shah Joy](mailto:miyaadshahjoy@gmail.com)

---

## 🏥 DocPatient Nexus

Making healthcare scheduling simpler, faster and smarter.
