const express = require('express');
const { google } = require('googleapis');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/config/swagger-config');
// Importing routes and controllers
const globalErrorHandler = require('./controllers/errorController');
const paymentController = require('./controllers/paymentController');
const calendarController = require('./controllers/calendarController');
const superAdminRouter = require('./routes/superAdminRoutes');
const adminRouter = require('./routes/adminRoutes');
const doctorRouter = require('./routes/doctorRoutes');
const patientRouter = require('./routes/patientRoutes');
const appointmenRouter = require('./routes/appointmentRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const calendarRouter = require('./routes/calendarRoutes');

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

//////////////////////////////////////////////////////////
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://127.0.0.1:3000/oauth/v2/callback',
);

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope, you can pass it as a string
  scope: scopes,
});
console.log(url);

async function getCalendarData(date) {
  const calendar = google.calendar({
    version: 'v3',
    auth: 'AIzaSyDewJKfvDoJeCgkCyRlb76uD_LYhoY2hYI',
  });

  // Calculate the start and end of the given date (UTC)
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  try {
    const response = await calendar.events.list({
      calendarId: 'miyaadjoy177@gmail.com',
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    const meetings = events.map((event) => {
      const start = event.start.dateTime || event.start.date;
      return `${event.summary} at ${start}`;
    });

    if (meetings.length > 0) {
      return {
        meetings,
      };
    }
    return {
      meetings: [],
    };
  } catch (err) {
    return {
      error: err.message,
    };
  }
}
getCalendarData('2025-07-10').then((data) => console.log(data));
//////////////////////////////////////////////////////////

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
app.use('/api/v2/calendars', calendarRouter);

app.get('/oauth/v2/callback', async (req, res) => {
  const { code } = req.query;
  // This will provide an object with the access_token and refresh_token.
  // Save these somewhere safe so they can be used at a later time.
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  console.log(tokens);
  const accessToken = tokens.access_token;

  // Refer to the Node.js quickstart on how to setup the environment:
  // https://developers.google.com/workspace/calendar/quickstart/node
  // Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
  // stored credentials.

  const event = {
    summary: 'Google I/O 2015',
    location: '800 Howard St., San Francisco, CA 94103',
    description: "A chance to hear more about Google's developer products.",
    start: {
      dateTime: '2025-07-10T12:00:00+06:00',
      timeZone: 'Asia/Dhaka',
    },
    end: {
      dateTime: '2025-07-10T17:00:00+06:00',
      timeZone: 'Asia/Dhaka',
    },
    recurrence: ['RRULE:FREQ=DAILY;COUNT=2'],
    attendees: [{ email: 'lpage@example.com' }, { email: 'sbrin@example.com' }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });
  const response = await calendar.events.insert(
    {
      calendarId: 'miyaadjoy177@gmail.com',
      resource: event,
    },
    //   (err, event) => {
    //     if (err) {
    //       console.log(
    //         `There was an error contacting the Calendar service: ${err}`,
    //       );
    //       return;
    //     }
    //     console.log('Event created: %s', event.htmlLink);
    //   },
  );
  console.log('Event created: %s', response.data.htmlLink);

  res.status(200).json({
    status: 'success',
    message: 'Google OAuth2 callback successful',
    data: req.query,
  });
});

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
