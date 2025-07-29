const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Doctor = require('./doctorModel');
const Patient = require('./patientModel');
const {
  sendAppointmentNotification,
} = require('../services/notificationService');

const {
  createEvent,
  createNewAccessToken,
} = require('../controllers/calendarController');

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
      type: Date, // YYYY-MM-DD -> ISO 8601 Date Format
      required: [true, 'Appointment date is required'],
      // FIXME: Validate appointment date
      // validate: [
      //   {
      //     validator: (date) => DateTime.fromFormat(String(date), 'yyyy-MM-dd').isValid,
      //     message: 'Please provide a valid date',
      //   },
      // ],
    },
    appointmentSchedule: {
      type: {
        day: {
          type: String,
          required: true,
          enum: {
            values: [
              'saturday',
              'sunday',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
            ],
            message: 'Day must be a valid weekday',
          },
          trim: true,
        },
        hours: {
          from: {
            type: String, // HH:mm
            required: [true, 'Provide schedule start time'],
            validate: {
              validator: (time) => DateTime.fromFormat(time, 'HH:mm').isValid,
              message: '"from" time must be in HH:mm format.',
            },
          },
          to: {
            type: String, // HH:mm
            required: [true, 'Provide schedule end time'],
            validate: {
              validator: (time) => DateTime.fromFormat(time, 'HH:mm').isValid,
              message: '"to" time must be in HH:mm format.',
            },
          },
        },
      },
      required: [true, 'Appointment schedule is required'],
      validate: {
        validator: (schedule) => {
          const { from, to } = schedule.hours;
          const fromTime = DateTime.fromFormat(from, 'HH:mm');
          const toTime = DateTime.fromFormat(to, 'HH:mm');
          return fromTime < toTime;
        },
        message: '"from" time must be before "to" time',
      },
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
      default: 'in-person',
      trim: true,
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'cash', 'unknown'],
    },
    paymentIntent: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    isPrescribed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

appointmentSchema.index(
  {
    doctor: 1,
    patient: 1,
    appointmentDate: 1,
  },

  { unique: true }, // Adding a compound index to optimize queries
);
appointmentSchema.index({ appointmentDate: 1 });

appointmentSchema.pre('findOneAndUpdate', async function (next) {
  // 'this' -> points to the current query

  this._oldDoc = await this.model.findOne(this.getFilter()); // this.getFilter() -> returns "{_id: '6854329adf383c789fe6d339'}"
  next();
});

appointmentSchema.post('findOneAndUpdate', async function (doc) {
  // 'this' points to the current query
  if (!this._oldDoc || !doc) return;
  if (this._oldDoc.status !== 'confirmed' && doc.status === 'confirmed') {
    // TODO: Add transactional safety with MongoDB Transactions
    // appointment confirmed
    console.log('🎉 Appointment confirmed!');
    const doctor = await Doctor.findById(doc.doctor);
    const patient = await Patient.findById(doc.patient);
    const appointment = doc;

    try {
      // Send email notifications to the doctor and patient
      await sendAppointmentNotification(appointment, doctor, patient);

      // send appointment reminder to the doctor and patient
      sendAppointmentReminder(appointment, doctor, patient);
    } catch (err) {
      console.error(err);
    }
    // Check if the doctor's access token is expired
    if (
      doctor?.calendar?.accessTokenExpiry &&
      new Date(doctor.calendar.accessTokenExpiry).getTime() < Date.now()
    )
      await createNewAccessToken(doctor);
    // create an event to doctor's calendar
    const response = await createEvent(appointment, doctor, patient);
    console.log(response);
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
