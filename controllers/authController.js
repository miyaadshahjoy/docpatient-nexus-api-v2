const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { decrypt } = require('../utils/cryptoHelper');

///////////////////////////////////////////////
const getModel = require('../utils/getModel');

const verifyAccountEligibility = require('../utils/verifyAccountEligibility');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const welcomeEmailTemplate = require('../utils/emailTemplates/welcomeEmailTemplate');
const passwordResetTemplate = require('../utils/emailTemplates/passwordResetEmailTemplate');

const generateJWT = (user) => {
  let role;
  // admins can have multiple roles
  if (user.roles && Array.isArray(user.roles) && user.roles.includes('admin'))
    role = 'admin';
  else {
    ({ role } = user); // Destructuring: This is same as -> role = user.role;
  }
  return jwt.sign(
    {
      id: user._id,
      role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    },
  );
};

// TODO: Send an email to the respective admin/super-admin when a new user signs up
// Admin -> Super-Admin
// Doctor -> Doctor-Manager
// Patient -> Patient-Manager
// This will help in keeping track of new user registrations and approvals
exports.signup = (Model) =>
  catchAsync(async (req, res, next) => {
    // Check if request body is empty
    if (!req.body)
      return next(new AppError('Please provide user data to sign up', 400));

    if (req.body.phone || req.body.email) {
      // Check if email already exists
      let existingUser = await Model.find({ email: req.body.email });
      if (existingUser.length > 0)
        return next(
          new AppError(
            'Email already exists. Please use a different email.',
            409,
          ),
        );

      // Check if phone number already exists
      existingUser = await Model.find({ phone: req.body.phone });
      if (existingUser.length > 0)
        return next(
          new AppError(
            'Phone number already exists. Please use a different phone number',
            409,
          ),
        );
    }

    // Create new user
    const newUser = await Model.create(req.body);
    if (!newUser)
      return next(
        new AppError('Failed to create user. Please try again.', 500),
      );
    newUser.password = undefined; // Remove password from response

    // send a welcome email for the newly registered user
    const html = welcomeEmailTemplate({
      userName: newUser.fullName,
      emailVerificationLink: `${process.env.FRONTEND_URL}/email-verification`,
    });
    try {
      await sendEmail({
        to: newUser.email,
        subject: 'Welcome to DocPatient Nexus application',
        html,
      });
    } catch (err) {
      console.error('❌ Failed to send welcome email:', err.message);
    }

    const resourceName = `${Model.modelName}`;

    res.status(201);
    res.json({
      status: 'success',

      message: `${resourceName} registered successfully.`,
      data: {
        [resourceName]: newUser,
      },
    });
  });

exports.signin = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body)
      return next(
        new AppError('Please provide email and password to sign in', 400),
      );
    // 1) Check if email and password exists
    const { email, password } = req.body;
    if (!email || !password)
      return next(new AppError('Enter email and password to sign in', 400));
    // 2) Check if email exists and password is correct
    const user = await Model.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password)))
      return next(
        new AppError(
          'Invalid email or password.Please provide valid credentials.',
          400,
        ),
      );

    // checking account eligibility
    verifyAccountEligibility(user);
    // 3) If everything is ok, return jwt token

    const token = generateJWT(user);
    const resourceName = `${Model.modelName}`;
    user.password = undefined; // Remove password from response
    // 4) Send response
    res.status(200);
    res.json({
      status: 'success',
      jwt: token,
      message: `${resourceName} signed in successfully.`,
      data: {
        user,
      },
    });
  });

// Authentication
exports.protect = () =>
  catchAsync(async (req, res, next) => {
    // 1) Getting token and check if its there
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer'))
      return next(
        new AppError('Authentication token is missing or malformed.', 401),
      );
    // 2) Verification of token
    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return next(new AppError('Invalid or expired token.', 401));
    }

    if (!decoded) return next(new AppError('Invalid token payload.', 401));
    if (!decoded.role)
      return next(new AppError('Role is missing in token payload.', 401));

    // Dynamically import the model based on user role
    // This assumes that the role is one of 'admin', 'doctor', or 'patient'

    const Model = getModel(decoded.role);

    // 3) Check if user still exists
    const user = await Model.findById(decoded.id);

    if (!user)
      return next(
        new AppError(
          'The user associated with this token no longer exists',
          404,
        ),
      );
    // 4) Check if user changed password after the token was issued
    if (user.passwordChangedAfter(decoded.iat))
      return next(
        new AppError(
          'Password was changed after the token was issued. Please sign in again.',
          401,
        ),
      );
    req.user = user;
    next();
  });

//   Authorization
exports.restrictTo =
  (...allowedRoles) =>
  (req, res, next) => {
    let allowed;
    if (req.user.roles && Array.isArray(req.user.roles))
      allowed = req.user.roles.every((role) => allowedRoles.includes(role));
    else allowed = allowedRoles.includes(req.user.role);
    if (!allowed)
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    next();
  };

exports.forgotPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    // 1) Get user based on the posted Email
    const { email } = req.body;
    if (!email)
      return next(new AppError('Please provide a valid email address.', 400));
    const user = await Model.findOne({ email });
    // console.log(user)
    if (!user)
      return next(
        new AppError(
          `No ${Model.modelName.toLowerCase()} found with the provided email address.`,
          404,
        ),
      );

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // 3) Send the reset token to users' email

    const resetUrl = `https://docpatient-nexus.onrender.com/api/v2/patients/reset-password/${resetToken}`;

    const html = passwordResetTemplate({
      userName: user.fullName,
      resetUrl,
    });
    const options = {
      to: user.email,
      subject: 'Password reset token (Expires in 10 mins)',
      message: `
      You requested a password reset.\n\n
      Click the link below to reset your password. This link is valid for 10 minutes:\n
      ${resetUrl}\n\n
      If you didn’t request this, please ignore this email.
    `,
      html,
    };
    try {
      await sendEmail(options);

      res.status(200).json({
        status: 'success',
        message: 'Password reset link has been sent to your email.',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Please try again later.',
          500,
        ),
      );
    }
  });

exports.resetPassword = (Model) =>
  catchAsync(async (req, res, next) => {
    const { password, passwordConfirm } = req.body;
    if (!password || !passwordConfirm)
      return next(
        new AppError('Please provide password and passwordConfirm', 400),
      );
    if (password !== passwordConfirm)
      return next(new AppError('Passwords do not match', 400));
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    // 1) Get user based on the token
    const user = await Model.findOne({ passwordResetToken });
    if (!user || user.passwordResetExpires < Date.now())
      return next(
        new AppError('Invalid password reset token or token has expired.', 400),
      );

    // 2) If token has not expired, and there is user, set the new password
    user.password = password;
    user.passwordConfirm = passwordConfirm;

    // 3) Update changedPasswordAt property for the user
    user.passwordChangedAt = new Date();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully.',
    });
  });

exports.sendEmailVerification = (Model) =>
  catchAsync(async (req, res, next) => {
    const resourceName = `${Model.modelName.toLowerCase()}`;
    // Check if request body is empty or email is not provided
    if (!req.body || !req.body.email)
      return next(
        new AppError(`Please provide an email to send verification link.`, 400),
      );

    // Check email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email))
      return next(new AppError('Please provide a valid email address.', 400));

    // Check if user exists with the provided email
    const user = await Model.findOne({ email: req.body.email });

    if (!user)
      return next(
        new AppError(
          `No ${resourceName} found with the provided email address.`,
          404,
        ),
      );

    if (user.emailVerified)
      return next(new AppError('Email is already verified', 400));

    const verificationToken = user.createEmailVerificationToken();
    await user.save();

    const url = `${process.env.FRONTEND_URL}/api/v2/doctors/email-verificaion/${verificationToken}`;
    const message = `
      You requested an email verification.\n\n
      Click the link below to verify your email. This link is valid for 10 minutes.\n
      ${url}.\n\n
      If you didn’t request this, please ignore this email.
    `;
    const emailOptions = {
      to: user.email,
      subject: 'Email verification link (Expires in 10 minutes)',
      message,
    };
    try {
      await sendEmail(emailOptions);
    } catch (err) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Please try after some time.',
          500,
        ),
      );
    }
    res.status(200).json({
      status: 'success',
      message: 'Email verification link sent successfully. Check your inbox.',
    });
  });

exports.verifyEmail = (Model) =>
  catchAsync(async (req, res, next) => {
    // Check if token is provided
    if (!req.params.token)
      return next(
        new AppError('No verification token found in the request.', 404),
      );

    // decrypt the token to get the email
    const email = decrypt(req.params.token);
    if (!email)
      return next(
        new AppError('Email address is missing in token payload.', 400),
      );
    // Check if email is already verified
    const existingUser = await Model.findOne({ email }).select(
      '+emailVerificationToken +emailVerificationExpires',
    );

    if (!existingUser)
      return next(new AppError('No user found wih this email', 404));

    // If email is already verified, return an error
    if (existingUser.emailVerified)
      return next(new AppError('Email is already verified', 400));

    // Hash the token to compare with the stored token
    const hashedVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');
    // Check if the token is valid and not expired
    if (
      existingUser.emailVerificationToken !== hashedVerificationToken ||
      existingUser.emailVerificationExpires < Date.now()
    )
      return next(
        new AppError(
          'The email verification link is invalid or has expired',
          400,
        ),
      );

    // If user exists, verify the email
    existingUser.emailVerified = true;
    existingUser.emailVerificationToken = undefined;
    existingUser.emailVerificationExpires = undefined;
    await existingUser.save();

    res.status(200).json({
      status: 'success',
      message: 'Email verified successfully.',
    });
  });
