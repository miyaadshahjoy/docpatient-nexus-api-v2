const { google } = require('googleapis');
const axios = require('axios');
const AppError = require('../utils/appError');
const { encrypt } = require('../utils/cryptoHelper');

const createOAuth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );

exports.createCalendar = async (accessToken, doctor) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars`,
      data: {
        summary: 'DocPatient Nexus',
        description: 'Calendar for DocPatient Nexus API',
        timeZone: 'Asia/Dhaka',
        location: doctor.location.address,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error(
      '❌ Error creating calendar',
      error?.response?.data || error.message,
    );
    throw new AppError('Failed to create calendar.', 500);
  }
};

const generateOAuthURL = (req, res, next) => {
  const oauth2Client = createOAuth2Client();

  // Generate a url that asks permissions for Google Calendar scopes
  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events',
  ];

  // Encrypting the doctor id before sending it as a state
  const encryptedDoctorID = encrypt(req.user.id);

  // Generate the OAuth2 url
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    // If you only need one scope, you can pass it as a string
    scope: scopes,
    state: encryptedDoctorID,
  });
  res.status(201).json({
    status: 'success',
    message: 'Google OAuth2 url generated successfully',
    data: {
      url,
    },
  });
};

exports.createEvent = async (appointment, doctor, patient) => {
  const calendarId = doctor.calendar.calendarUID;
  const appointmentDate = new Date(appointment.appointmentDate)
    .toISOString()
    .split('T')[0];
  const startTime = appointment.appointmentSchedule.hours.from; // "09:00"
  const endTime = appointment.appointmentSchedule.hours.to; // "09:59"
  const startDateTime = `${appointmentDate}T${startTime}:00`;
  const endDateTime = `${appointmentDate}T${endTime}:00`;

  try {
    const response = await axios({
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
      data: {
        summary: `Appointment: Dr. ${doctor.fullName} has an appointment with ${patient.fullName}.`,
        description: `Dr. ${doctor.fullName} has an appointment with  ${patient.fullName} on ${appointmentDate}for "${appointment.reason}".`,

        start: {
          dateTime: startDateTime,
          timeZone: 'Asia/Dhaka',
        },
        end: {
          dateTime: endDateTime,
          timeZone: 'Asia/Dhaka',
        },
        attendees: [
          {
            email: doctor.email,
          },
          {
            email: patient.email,
          },
        ],
        location: doctor.location.address,
        transparency: 'opaque',
        visibility: 'public',
        sendUpdates: 'all',
      },
      headers: {
        Authorization: `Bearer ${doctor.calendar.accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (err) {
    console.error('❌ Error creating event', err?.response?.data || err.errors);
    throw new AppError('Failed to create event.', 500);
  }
};

exports.createNewAccessToken = async (doctor) => {
  try {
    if (!doctor.calendar.refreshToken)
      throw new AppError(
        'Refresh token not found. Please re-authenticate the doctor.',
        400,
      );
    const response = await axios({
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: doctor.calendar.refreshToken,
        grant_type: 'refresh_token',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const newAccessToken = response.data.access_token;
    const newTokenExpiresIn = response.data.expires_in;
    doctor.calendar.accessToken = newAccessToken;
    doctor.calendar.accessTokenExpiry = new Date(
      newTokenExpiresIn * 1000 + Date.now(),
    );
    await doctor.save();
  } catch (err) {
    console.error(
      '❌ Error creating new access token:',
      err?.response?.data || err?.message || err,
    );

    throw new AppError('Failed to create new access token.', 500);
  }
};
exports.generateOAuthURL = generateOAuthURL;
exports.createOAuth2Client = createOAuth2Client;
