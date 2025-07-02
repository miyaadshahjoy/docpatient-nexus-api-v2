const Prescription = require('../models/prescriptionModel');
const Appointment = require('../models/appointmentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Patient = require('../models/patientModel');

const { scheduleMedicationReminder } = require('../services/reminderService');
const generateMedicationSchedule = require('../utils/generateMedicationSchedule');

exports.createPrescription = catchAsync(async (req, res, next) => {
  const appointmentId = req.params.id;

  if (!appointmentId)
    return next(new AppError(' Appointment ID is required.', 400));
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(
      new AppError('No appointment found with the provided ID.', 404),
    );
  // Check if the Appointment is pending or cancelled -> only confirmed or completed appointments can have prescriptions
  if (appointment.status === 'pending' || appointment.status === 'cancelled')
    return next(
      new AppError('Appointment must be confirmed or completed.', 400),
    );
  if (appointment.isPrescribed)
    return next(
      new AppError('Prescription already exists for this appointment.', 400),
    );

  req.body.doctor = appointment.doctor;
  req.body.appointment = appointment._id;
  const patient = await Patient.findById(appointment.patient);
  let newPrescription;
  try {
    newPrescription = await Prescription.create(req.body);
  } catch (error) {
    console.error('❌ Failed to create prescription:', error);
    return next(
      new AppError('Internal error. Failed to create prescription.', 500),
    );
  }

  const reminders = generateMedicationSchedule(newPrescription, patient);
  if (!reminders || reminders.length === 0)
    console.warn('⚠ No reminders generated for this prescription.');

  for (const reminder of reminders) {
    if (!reminder) continue;
    reminder.scheduledFor.setMinutes(reminder.scheduledFor.getMinutes() - 10);
    scheduleMedicationReminder({
      to: reminder.patient,
      subject: '💊 Medication reminder.',
      message: `Take your medication: ${reminder.name} at ${reminder.scheduledFor}. ${reminder.instruction}. Follow your doctor's instructions.`,
      html: reminder.html,
      sendAt: reminder.scheduledFor,
    });
  }

  // Add the prescription ID to the patient
  try {
    patient.prescriptions.push(newPrescription._id);
    await patient.save();
  } catch (error) {
    return next(
      new AppError(
        'Internal error. Failed to add prescription to patient.',
        500,
      ),
    );
  }

  res.status(201).json({
    status: `success`,
    message: 'Prescription created successfully.',
    data: {
      prescription: newPrescription,
    },
  });
});
