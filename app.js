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
app.use(
  cors({
    origin: '*',
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

// Swagger Documentation

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
