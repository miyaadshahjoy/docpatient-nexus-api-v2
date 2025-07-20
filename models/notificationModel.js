const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      required: [true, 'Notification must have a recipient.'],
      refPath: 'recipientModel',
    },
    recipientModel: {
      type: String,
      required: true,
      enum: ['Admin', 'Doctor', 'Patient'],
    },

    type: {
      type: String,
      required: [true, 'Notification type is required.'],
      enum: ['appointment', 'medication', 'system', 'custom'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required.'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required.'],
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    scheduledOn: Date,
    sentAt: {
      type: Date,
      default: Date.now,
    },
    deliveryStatus: {
      type: 'String',
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    channel: {
      type: [String],
      enum: ['email', 'sms', 'in-app'],
      default: ['email'],
      validate: {
        validator: function (channel) {
          return (
            Array.isArray(channel) && new Set(channel).size === channel.length
          );
        },
        message: 'Channels must be unique.',
      },
    },
    category: {
      type: String,
      enum: ['reminder', 'alert', 'update', 'system'],
      default: 'update',
    },
  },
  { timestamps: true },
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

/*
{
  "recipient": "6654d0a9ab12345deff891a1",
  "recipientModel": "Patient",
  "type": "medication",
  "title": "Time to take your medication",
  "message": "Please take 1 tablet of Paracetamol (500mg) with water.",
  "metadata": {
    "prescriptionId": "6621aaaadcb123456f000123",
    "medication": "Paracetamol",
    "dosage": "500mg",
    "frequency": "2x/day"
  },
  "isRead": false,
  "sentAt": "2025-06-15T06:00:00Z",
  "scheduledFor": "2025-06-15T08:00:00Z",
  "channel": ["email", "in-app"]
}
*/
