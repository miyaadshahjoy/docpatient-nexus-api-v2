const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Medication must have a name.'],
      trim: true,
    },
    dosage: {
      type: String, // (e.g. 500mg)
      required: [true, 'Medication must have dosage.'],
      trim: true,
    },
    frequency: {
      type: [String], // HH:mm format (e.g. ['08:00', '12:00', '18:00'])
      required: [true, 'Medication must have frequency'],
      validate: [
        {
          validator: function (arr) {
            return arr.every((t) => /^\d{2}:\d{2}$/.test(t));
          },
          message: 'Each frequency time must be in HH:mm format.',
        },
        {
          validator: function (arr) {
            const times = arr.map((t) => t.split(':').map(Number));
            for (let i = 1; i < times.length; i += 1) {
              const [h1, m1] = times[i - 1];
              const [h2, m2] = times[i];
              if (h1 * 60 + m1 >= h2 * 60 + m2) return false;
            }
            return true;
          },
          message: 'Frequency times must be in ascending order.',
        },
      ],
    },
    duration: {
      type: Number, // in days
      required: [true, 'Medication must have a duration'],
      min: [1, 'Duration must be at least 1 day'],
    },
    instruction: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
const prescriptionSchema = mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Doctor',
      required: [true, 'Doctor is required.'],
      immutable: true,
    },
    appointment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Appointment',
      required: [true, 'Appointment is required.'],
      immutable: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    medications: {
      type: [medicationSchema],
      required: [true, 'Prescription must have medications.'],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.length > 0;
        },
        message: 'Prescription must have at least one medication.',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'expired', 'deleted'],
        message: 'Status must be "active", "expired", or "deleted" ',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);
// Virtual for Medication End Date
medicationSchema.virtual('medicationEndDate').get(function () {
  if (!this.createdAt || !this.duration) return null;
  return new Date(
    new Date(this.createdAt).getTime() + this.duration * 24 * 60 * 60 * 1000,
  );
});

// TODO: Create job that will make the prescription expired when all the medication is expired

prescriptionSchema.index(
  {
    doctor: 1,
    appointment: 1,
  },
  {
    unique: true,
  },
);
prescriptionSchema.index({
  doctor: 1,
});
prescriptionSchema.index({
  appointment: 1,
});
prescriptionSchema.index({
  status: 1,
});

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
