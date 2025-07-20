const mongoose = require('mongoose');

const patientRecordSchema = new mongoose.Schema(
  {
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],
    conditions: [
      {
        type: String,
        trim: true,
      },
    ],
    surgeries: [
      {
        type: String,
        trim: true,
      },
    ],
    familyHistory: [
      {
        type: String,
        trim: true,
      },
    ],
    lifestyle: {
      badHabits: {
        type: [String],
        enum: ['smoking', 'alcohol', 'drugs'],
        default: [],
      },
      exercise: {
        type: String,
        enum: ['none', 'light', 'moderate', 'intense'],
      },
    },
    medications: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Prescription',
      },
    ],
    reports: [
      {
        title: {
          type: String,
          trim: true,
          required: [true, 'Report title is required.'],
        },
        description: {
          type: String,
          trim: true,
          required: [true, 'Report description is required.'],
        },
        fileUrl: {
          type: String,
          trim: true,
          required: [true, 'File URL is required in a report.'],
          validate: {
            validator: function (str) {
              return /\.(pdf|jpg|jpeg|png)$/i.test(str);
            },
            message:
              'Invalid file type. Only JPEG, PNG, and PDF files are allowed.',
          },
        },
        issuedBy: {
          type: String,
          trim: true,
          required: [true, 'Issued by is required in a report.'],
        },
        issuedOn: {
          type: Date,
          required: [true, 'IssuedOn is required in a report'],
        },
      },
    ],
  },
  { timestamps: true },
);

patientRecordSchema.index({ 'lifestyle.exercise': 1 });
patientRecordSchema.index({ 'lifestyle.badHabits': 1 });

const PatientRecord = mongoose.model('PatientRecord', patientRecordSchema);

module.exports = PatientRecord;
