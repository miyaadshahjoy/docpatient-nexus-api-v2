const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviewModel');

exports.postReview = catchAsync(async (req, res, next) => {
  if (!Object.keys(req.body).length)
    return next(new AppError('No review data provided', 400));
  const { review: reviewText, rating } = req.body;

  if (!reviewText || !rating)
    return next(new AppError('Please provide a review text and a rating', 400));

  const appointmentId = req.params.id;
  if (!appointmentId)
    return next(new AppError('Please provide a valid appointment Id', 404));

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment found with provided ID.', 404));

  if (!appointment.patient.equals(req.user._id))
    return next(
      new AppError('You are not allowed to post a review here.', 403),
    );

  // Check if the appointment already has a review
  const existingReview = await Review.findOne({ appointment: appointmentId });
  if (existingReview)
    return next(
      new AppError(
        'You have already posted a review for this appointment.',
        400,
      ),
    );

  if (appointment.status !== 'completed')
    return next(
      new AppError(
        'You can only post a review for completed appointments.',
        400,
      ),
    );

  // Create a session to handle transactions
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.create(
      {
        doctor: appointment.doctor,
        patient: appointment.patient,
        appointment: appointment._id,
        review: reviewText,
        rating,
      },

      { session },
    );
    if (!review) throw new AppError('Failed to create review.', 500);
    // Associate the review with the appointment
    // This is done to ensure that the appointment has a reference to the review
    // try {
    //   appointment.review = review._id;
    //   await appointment.save();
    // } catch (err) {
    //   console.error(
    //     '❌ Error associating review with appointment:',
    //     err.message,
    //   );
    // }

    // Update the doctor's average rating using a transaction in a static method
    await Review.calcAverageRating(appointment.doctor, session);

    await session.commitTransaction();

    res.status(201).json({
      status: 'success',
      message: 'Review posted successfully',
      review: review[0],
    });
  } catch (err) {
    await session.abortTransaction();

    console.error(
      `❌ Failed to create review for appointment: ${appointmentId}`,
      err,
    );
    if (err.code === 11000)
      return next(
        new AppError(
          'You have already posted a review for this appointment.',
          400,
        ),
      );

    return next(
      new AppError(
        'Something went wrong while submitting your review. Please try again shortly or contact support.',
        500,
      ),
    );
  } finally {
    session.endSession();
  }
});

exports.updateReview = catchAsync(async (req, res, next) => {
  if (!Object.keys(req.body).length)
    return next(new AppError('No review data provided', 400));

  if (!req.params.id)
    return next(new AppError('No appointment ID provided', 400));
  const appointmentId = req.params.id;
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment)
    return next(new AppError('No appointment found with provided ID.', 404));
  // Create a session to handle transactions
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const review = await Review.findOne({ appointment: appointmentId });
    if (!review)
      throw new AppError('No review found for this appointment.', 404);
    if (!review.patient.equals(req.user._id))
      throw new AppError('You are not allowed to update this review.', 403);
    const updatedReview = await Review.findByIdAndUpdate(review._id, req.body, {
      new: true,
      runValidators: true,
      session: session,
    });

    await Review.calcAverageRating(appointment.doctor, session);

    await session.commitTransaction();

    res.status(200).json({
      status: 'success',
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (err) {
    await session.abortTransaction();

    console.error(
      `❌ Failed to update review for appointment: ${appointmentId}`,
      err,
    );

    return next(
      new AppError(
        'Something went wrong while updating your review. Please try again shortly or contact support.',
        500,
      ),
    );
  } finally {
    session.endSession();
  }
});
