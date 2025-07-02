const mongoose = require('mongoose');
const Doctor = require('./doctorModel');
const Patient = require('./patientModel');
const {
  sendAppointmentNotification,
} = require('../services/notificationService');

const sendAppointmentReminder = require('../utils/sendAppointmentReminder');

const appointmentSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Appointment must be assigned to a doctor'],
    },
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'Patient',
      required: [true, 'Appointment must have a patient'],
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    appointmentSchedule: {
      type: {
        day: {
          type: String,
          required: true,
        },
        hours: {
          from: {
            type: String,
            required: [true, 'Provide schedule start time'],
          },
          to: {
            type: String,
            required: [true, 'Provide schedule end time'],
          },
        },
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    reason: {
      type: String,
      trim: true,
      required: [true, 'Please provide a reason for the appointment'],
    },
    notes: {
      type: String,
      trim: true,
    },
    consultationType: {
      type: String,
      enum: ['in-person', 'online'],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'unknown'],
    },
    paymentIntent: String,
    isPrescribed: {
      type: Boolean,
      default: false,
    },
    // review: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Review',
    // },
  },
  { timestamps: true },
);

appointmentSchema.pre('findOneAndUpdate', async function (next) {
  // 'this' points to the current query

  this._oldDoc = await this.model.findOne(this.getFilter()); // this.getFilter() -> returns "{_id: '6854329adf383c789fe6d339'}"
  next();
});

appointmentSchema.post('findOneAndUpdate', async function (doc) {
  // 'this' points to the current query
  if (!this._oldDoc || !doc) return;
  if (this._oldDoc.status !== 'confirmed' && doc.status === 'confirmed') {
    // appointment confirmed
    console.log('🎉 Appointment confirmed!');
    const doctor = await Doctor.findById(doc.doctor);
    const patient = await Patient.findById(doc.patient);
    const appointment = doc;

    // Send email notifications to the doctor and patient
    await sendAppointmentNotification(appointment, doctor, patient);

    // send appointment reminder to the doctor and patient
    sendAppointmentReminder(appointment, doctor, patient);
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
