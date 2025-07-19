const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { addInstanceMethods } = require('../utils/schemaUtil');

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      minLength: [1, 'Full name must contain atleast 1 character'],
      maxLength: [30, 'Fullname must not excedd 30 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address.'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'others', 'prefer not to say'],
        message:
          'Gender must be either male, female, others, or prefer not to say',
      },
      required: [true, 'Gender is required'],
      trim: true,
    },
    profilePhoto: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [8, 'Password must be atleast 8 characters long'],
      select: false,
      trim: true,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        validator: function (el) {
          return this.password === el;
        },
        message: 'Passwords do not match',
      },
      select: false,
    },
    roles: {
      type: [String],
      enum: [
        'admin',
        'super-admin',
        'doctor-manager',
        'patient-manager',
        'appointment-manager',
        'review-manager',
        'record-manager',
        'notification-manager',
      ],
      default: ['admin'],
      // immutable: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'pending', 'deleted'],
        message: 'Status must be either active, pending, or deleted.',
      },
      default: 'pending',
      trim: true,
    },
    deletedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Admin',
    },
    deletedAt: Date,

    ///////////////////////////////////////////
    // Non-selected fields
    passwordChangedAt: {
      type: Date,
      select: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt
);

// instance methods
addInstanceMethods(adminSchema);
// middlewares

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (this.isNew) this.passwordChangedAt = Date.now() - 1000; // this is to prevent token issued right before saving from being invalidated due to async delay

  // Encrypt the password with bcrypt
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

adminSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ status: { $ne: 'deleted' } });
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
