const Patient = require('../models/patientModel');
const PatientRecord = require('../models/patientRecordModel');
const Prescription = require('../models/prescriptionModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createRecord = catchAsync(async (req, res, next) => {
  // Check if patient ID is provided in the request parameters

  const patientId = req.params.id;
  if (!patientId) return next(new AppError('No patient ID provided.', 400));

  // Check if the request body is empty
  if (Object.keys(req.body).length === 0)
    return next(new AppError('No data found in request body.', 400));

  // TODO: Doctors who have no appointment with the patient should not be able to create a record.
  // Check if the user is a doctor and has permission to create a record for the patient

  // Check if the patient exists
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient found with the provided ID.', 404));

  // const recordExists = patient.patientRecords;

  if (patient.patientRecords)
    return next(new AppError('Record already exists for this patient.', 400));
  // req.body.patient = patientId;

  const prescriptions = await Prescription.find({
    patient: patientId,
    status: 'active',
  });

  const medications = prescriptions.map((p) => p.medications).flat();

  const medicationsIds = medications.map((med) => med._id);
  req.body.medications = medicationsIds;

  const newRecord = await PatientRecord.create(req.body);
  if (!newRecord)
    return next(new AppError('Internal error. Failed to create record.', 500));
  try {
    patient.patientRecords = newRecord;
    await patient.save();
  } catch (error) {
    return next(
      new AppError(
        'Internal error. Failed to add patient record to patient.',
        500,
      ),
    );
  }

  res.status(201).json({
    status: 'success',
    message: 'Patient record created successfully.',
    data: {
      newRecord,
    },
  });
});

exports.updateRecord = catchAsync(async (req, res, next) => {

  // Check if patient ID is provided in the request parameters
  if (!req.params.id) return next(new AppError('No patient ID provided.', 400));

  const patientId = req.params.id;

  // Check if request body is empty
  if (Object.keys(req.body).length === 0)
    return next(new AppError('No data found in request body.', 400));

  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient found with the provided ID.', 404));
  
  if(!patient.patientRecords)
    return next(new AppError('No record found for this patient.', 404));

  const record = await PatientRecord.findById(patient.patientRecords);
  if (!record)
    return next(new AppError('No record exists for this patient.', 404));

  const updatedRecord = await PatientRecord.findByIdAndUpdate(record._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: 'Patient record updated successfully.',
    data: {
      updatedRecord,
    },
  });
  
})
exports.uploadReport = catchAsync(async (req, res, next) => {
  // Check if files are uploaded
  if (!req.file) {
    return next(new AppError('No files uploaded.', 400));
  }
  console.log(req.body);
  if (
    !req.body ||
    !req.body.title ||
    !req.body.description ||
    !req.body.issuedBy ||
    !req.body.issuedOn
  ) {
    return next(new AppError('Missing required fields in request body.', 400));
  }
  
  if (!req.params.id) {
    return next(new AppError('No patient ID provided.', 400));
  }
  const patientId = req.params.id;

  // Check if the patient exists
  const patient = await Patient.findById(patientId);
  if (!patient)
    return next(new AppError('No patient found with the provided ID.', 404));

  if(!patient.patientRecords)
    return next(new AppError('No record found for this patient.', 404));
  
  const existingRecord = await PatientRecord.findById(patient.patientRecords);
  if (!existingRecord)
    return next(new AppError('No record exists for this patient.', 404));

  // Add the uploaded file path to the record
  existingRecord.reports.push({
    title: req.body.title,
    description: req.body.description,
    fileUrl: req.file.filename,
    issuedBy: req.body.issuedBy,
    issuedOn: req.body.issuedOn,
  });
  const record = await existingRecord.save();

  res.status(201).json({
    status: 'success',
    message: 'Patient report uploaded successfully.',
    data: {
      record,
    },
  });
});
