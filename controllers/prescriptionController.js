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

// PATCH /api/v2/doctors/appointments/{appointmentId}/prescription/
exports.updatePrescription = catchAsync(async (req, res, next) => {
  if (Object.keys(req.body).length === 0)
    return next(new AppError('No fields were provided to update.', 400));

  const appointmentId = req.params.id;
  if (!appointmentId)
    return next(new AppError('No appointment ID provided.', 400));
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return next(
        new AppError('No appointment found with the provided ID.', 404),
      );

    const prescription = await Prescription.findOne({
      appointment: appointment._id,
    });
    if (!prescription)
      return next(
        new AppError('No prescription found for this appointment.', 404),
      );
    if (prescription.status === 'expired' || prescription.status === 'deleted')
      return next(
        new AppError('Cannot update expired or deleted prescriptions.', 400),
      );
    if (!prescription.doctor.equals(req.user.id))
      return next(
        new AppError(
          'You are not authorized to update this prescription.',
          403,
        ),
      );
    // restrict updates to only medications, and notes
    // FIXME: use a whitelist approach to allow only specific fields to be updated rather than blacklisting
    const filteredObject = {};
    const restrictedFields = ['doctor', 'appointment', 'status'];
    Object.keys(req.body).forEach((field) => {
      if (!restrictedFields.includes(field))
        filteredObject[field] = req.body[field];
    });

    if (Object.keys(filteredObject).length === 0)
      return next(new AppError('No valid fields to update.', 400));
    // Update the prescription
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescription._id,
      filteredObject,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPrescription)
      return next(new AppError('Failed to update prescription.', 500));
    res.status(200).json({
      status: 'success',
      message: 'Prescription updated successfully.',
      data: {
        prescription: updatedPrescription,
      },
    });
  } catch (err) {
    console.error('❌ Failed to update prescription:', err);
    return next(
      new AppError('Internal error. Failed to update prescription.', 500),
    );
  }
});

exports.getAllPrescriptions = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));

  try {
    const patient = await Patient.findById(patientId).populate('prescriptions');
    if (!patient)
      return next(new AppError('No Patient found with the provided ID.', 404));
    const { prescriptions } = patient;
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved all prescriptions.',
      resutls: prescriptions.length,
      data: {
        prescriptions,
      },
    });
  } catch (err) {
    console.error('❌ Failed to get prescriptions:', err);
    return next(
      new AppError('Internal error. Failed to get prescriptions.', 500),
    );
  }
});

exports.getPrescription = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));
  const { prescriptionId } = req.params;
  if (!prescriptionId)
    return next(new AppError('No prescription ID provided.', 400));
  try {
    const patient = await Patient.findById(patientId).populate('prescriptions');
    if (!patient)
      return next(new AppError('No Patient found with the provided ID.', 404));
    const prescription = patient.prescriptions.find((pre) =>
      pre._id.equals(prescriptionId),
    );
    if (!prescription)
      return next(
        new AppError('No Prescription found with the provided ID.', 404),
      );
    res.status(200).json({
      status: 'success',
      message: 'Successfully retrieved prescription.',
      data: {
        prescription,
      },
    });
  } catch (err) {
    console.error('❌ Failed to get prescription:', err);
    return next(
      new AppError('Internal error. Failed to get prescription.', 500),
    );
  }
});

exports.updateOnePrescription = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));
  const { prescriptionId } = req.params;
  if (!prescriptionId)
    return next(new AppError('No prescription ID provided.', 400));
  try {
    const patient = await Patient.findById(patientId).populate('prescriptions');
    if (!patient)
      return next(new AppError('No Patient found with the provided ID.', 404));
    const prescriptionExists = patient.prescriptions.find((pre) =>
      pre._id.equals(prescriptionId),
    );
    if (!prescriptionExists)
      return next(
        new AppError('This prescription does not exist for this patient.', 404),
      );
    const updatedPrescription = await Prescription.findByIdAndUpdate(
      prescriptionId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedPrescription)
      return next(new AppError('Failed to update prescription.', 500));
    res.status(200).json({
      status: 'success',
      message: 'Prescription updated successfully.',
      data: {
        prescription: updatedPrescription,
      },
    });
  } catch (err) {
    console.error('❌ Failed to update prescription:', err);
    return next(
      new AppError('Internal error. Failed to update prescription.', 500),
    );
  }
});

exports.deleteOnePrescription = catchAsync(async (req, res, next) => {
  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));

  const { prescriptionId } = req.params;
  if (!prescriptionId)
    return next(new AppError('No prescription ID provided.', 400));

  try {
    const patient = await Patient.findById(patientId).populate('prescriptions');
    if (!patient)
      return next(new AppError('No Patient found with the provided ID.', 404));
    const prescription = await Prescription.findById(prescriptionId);

    if (!prescription)
      return next(
        new AppError('No Prescription found with the provided ID.', 404),
      );

    if (prescription.status === 'deleted')
      return next(new AppError('Prescription is already deleted.', 400));
    prescription.status = 'deleted';
    await prescription.save();
    // Remove the prescription from the patient's prescriptions array
    patient.prescriptions = patient.prescriptions.filter(
      (pre) => !pre._id.equals(prescription._id),
    );
    await patient.save();

    res.status(204).json({
      status: 'success',
      message: 'Prescription deleted successfully.',
      data: null,
    });
  } catch (err) {
    console.error('❌ Failed to delete prescription:', err);
    return next(
      new AppError('Internal error. Failed to delete prescription.', 500),
    );
  }
});
