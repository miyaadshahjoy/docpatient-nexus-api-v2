const express = require('express');

const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/config/swagger-config');
// Importing routes and controllers
const globalErrorHandler = require('./controllers/errorController');
const paymentController = require('./controllers/paymentController');

const superAdminRouter = require('./routes/superAdminRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const patientRouter = require('./routes/patientRoutes');
const appointmenRouter = require('./routes/appointmentRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const {
  createOAuth2Client,
  createCalendar,
} = require('./controllers/calendarController');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const doctorModel = require('./models/doctorModel');
const { decrypt } = require('./utils/cryptoHelper');

// Initialize express app
const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    status: 'SUCCESS',
    message: 'DocPateint Nexus Homepage',
  });
});
// Webhook Route
app.post(
  '/api/v2/payments/webhooks',
  express.raw({ type: 'application/json' }),
  paymentController.stripeWebhookHandler,
);

// middlewares
// Serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// 3rd party middlewares
// CORS middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://docpatient-nexus.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

// body parser middleware
app.use(express.json());
app.use(morgan('dev'));

// Query String parser
app.set('query parser', require('qs').parse);

//Routes
app.use('/api/v2/super-admins', superAdminRouter);
app.use('/api/v2/admins', adminRouter);
app.use('/api/v2/doctors', doctorRouter);
app.use('/api/v2/patients', patientRouter);
app.use('/api/v2/appointments', appointmenRouter);
app.use('/api/v2/reviews', reviewRouter);

app.get(
  '/oauth/v2/callback',
  catchAsync(async (req, res, next) => {
    // Get the authorization code and state from the query
    const { code, state } = req.query;
    if (!code) return next(new AppError('No authorization code provided', 400));
    if (!state) return next(new AppError('No state found in the query', 404));

    // Get the OAuth2 client
    const oauth2Client = createOAuth2Client();
    // This will provide an object with the access_token and refresh_token.
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date,
    } = tokens;
    const accessTokenExpiry = new Date(expiry_date);

    try {
      // Decrypting the doctor id from the state
      const doctorId = decrypt(state);
      if (!doctorId)
        return next(
          new AppError(
            'Invalid state. Please re-authenticate the doctor.',
            400,
          ),
        );
      const doctor = await doctorModel.findById(doctorId);
      if (!doctor) throw new AppError('Doctor not found.', 404);

      // Check if a calendar already exists for the doctor
      if (doctor.calendar && doctor.calendar.calendarUID)
        return next(
          new AppError('A calendar already exists for this doctor.', 400),
        );

      const calendarId = await createCalendar(accessToken, doctor);
      const calendar = {
        calendarUID: calendarId,
        accessToken,
        refreshToken,
        accessTokenExpiry,
      };
      doctor.calendar = calendar;
      await doctor.save();

      res.status(200).json({
        status: 'success',
        message: 'Calendar created successfully.',
        data: {
          calendarId,
        },
      });
    } catch (error) {
      console.error('OAuth callback error:', error);
      return next(new AppError('Something went wrong. Try again later.', 500));
    }
  }),
);

// Route for API Documentation
app.use(
  '/api/v2/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'DocPatient Nexus API Docs',
    layout: 'BaseLayout',
    customCssUrl: `/css/swagger-custom.css`,
    customfavIcon: `/img/docpatient-nexus-icon.png`,
    customJs: `/js/swagger-custom.js`,
  }),
);

// handler function for unhandled routes
app.all('*wildcard', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}  on this server`,
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);
module.exports = app;
