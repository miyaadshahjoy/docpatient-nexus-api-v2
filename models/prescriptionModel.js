const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medication must have a name.'],
    trim: true,
  },
  dosage: {
    type: String,
    required: [true, 'Medication must have dosage.'],
    trim: true,
  },
  frequency: {
    type: [String], // HH:mm
    required: [true, 'Medication must have frequency'],
    validate: {
      validator: function (arr) {
        return arr.every((t) => /^\d{2}:\d{2}$/.test(t));
      },
      message: 'Each frequency time must be in HH:mm format.',
    },
  },
  duration: {
    type: Number, // in days
    required: [true, 'Medication must have a duraion'],
    min: [1, 'Duration must be atleast 1 day'],
  },
  instruction: {
    type: String,
    trim: true,
  },
});
const prescriptionSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required.'],
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required.'],
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'expired', 'deleted'],
        message: 'Status must be "active", "expired", or "deleted" ',
      },
      default: 'active',
    },
    medications: {
      type: [medicationSchema],
      required: [true, 'Prescription must have medications.'],
    },
  },
  {
    timestamps: true,
    toObjects: { virtuals: true },
    toJSON: { virtuals: true },
  },
);
prescriptionSchema.index({ doctor: 1, appointment: 1 }, { unique: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;

/*
{
  "_id": "665a7e4e6b0a8940b80d1234",
  "doctor": "665a7d5e6b0a8940b80d1111",
  "patient": "665a7d0a6b0a8940b80d9999",
  "appointment": "665a7e106b0a8940b80d2222",
  "notes": "Patient is recovering well. Continue meds.",
  "status": "active",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": ["08:00", "14:00", "20:00"],
      "duration": 5,
      "instruction": "Take after meals"
    },
    {
      "name": "Amoxicillin",
      "dosage": "250mg",
      "frequency": ["09:00", "21:00"],
      "duration": 7,
      "instruction": "Take with water"
    },
    {
      "name": "Cetirizine",
      "dosage": "10mg",
      "frequency": ["22:00"],
      "duration": 3,
      "instruction": "Take before bedtime"
    }
  ]
}

*/
