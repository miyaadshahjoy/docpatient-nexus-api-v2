const express = require('express');

const {
  checkAccountEligibility,
} = require('../middlewares/verifyAccountStatus');
const handlerFactory = require('../controllers/handlerFactory');
const authController = require('../controllers/authController');
const currentUserController = require('../controllers/currentUserController');
const Admin = require('../models/adminModel');
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword(Admin));

router.post('/reset-password/:resetToken', authController.resetPassword(Admin));

router.post('/signup', authController.signup(Admin));
router.post('/signin', authController.signin(Admin));

router.post('/email-verification', authController.sendEmailVerification(Admin));

router.patch('/email-verification/:token', authController.verifyEmail(Admin));
// router.use(checkAccountEligibility(Admin));
// Current User Routes
// Get Current User
router.get(
  '/me',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  currentUserController.updatePassword(Admin),
);

router.patch(
  '/me/password',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  currentUserController.updatePassword(Admin),
);
router.patch(
  '/me',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  currentUserController.updateCurrentUser(Admin),
);

router.delete(
  '/me',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  currentUserController.deleteCurrentUser(Admin),
);

// Approve Doctor Accounts
router.patch(
  '/approve-doctors/:id',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  authController.restrictTo('admin'),
  handlerFactory.approveAccount(Doctor),
);

// Approve Patient Accounts
router.patch(
  '/approve-patients/:id',
  authController.protect('admin'),
  checkAccountEligibility(Admin),
  authController.restrictTo('admin'),
  handlerFactory.approveAccount(Patient),
);
// Only Super-Admin can access these routes
// Get All Admins
router.get(
  '/',
  authController.protect(),
  authController.restrictTo('super-admin', 'admin'),
  checkAccountEligibility(Admin),
  handlerFactory.readAll(Admin),
);

router
  .route('/:id')
  .get(
    // Get Admin by ID
    authController.protect(),
    authController.restrictTo('super-admin', 'admin'),
    checkAccountEligibility(Admin),
    handlerFactory.readOne(Admin),
  )
  .patch(
    // Update Admin by ID
    authController.protect(),
    authController.restrictTo('super-admin', 'admin'),
    checkAccountEligibility(Admin),
    handlerFactory.updateOne(Admin),
  )
  .delete(
    // Delete Admin by ID
    authController.protect(),
    authController.restrictTo('super-admin', 'admin'),
    checkAccountEligibility(Admin),
    handlerFactory.deleteOne(Admin),
  );

module.exports = router;
