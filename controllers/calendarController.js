const axios = require('axios');
const qs = require('qs');
const Doctor = require('../models/doctorModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
////////////////////////////////////////////////////
const redirectURI = `http://127.0.0.1:3000/oauth/v2/callback`;
const clientId = '1000.SILJQBMY31TVZPGHUEMDTJ4YZ5A22J';
const clientSecret = '3f354c0e1c74db46ef75c21a4877b059db585d0214';
const scope = 'ZohoCalendar.event.ALL,ZohoCalendar.calendar.ALL';

const getAccessToken = catchAsync(async (req, res, next) => {
  const { state, code } = req.query;
  if (!state || !code)
    return next(
      new AppError(
        'Redirect URI doesnt have state and code query parameters.',
        400,
      ),
    );
  const doctorID = state;

  const tokenResponse = await axios.post(
    `https://accounts.zoho.com/oauth/v2/token?code=${code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&scope=${scope}&state=${state}`,
  );
  console.log(tokenResponse.data);
  if (tokenResponse.status !== 200)
    return next(
      new AppError('Something went wrong while fetching access token.', 500),
    );
  const {
    access_token: accessToken,
    // refresh_token: refreshToken, // FIXME:
    expires_in: expiresIn,
  } = tokenResponse.data;
  //   if (!accessToken || !refreshToken || !expiresIn)
  if (!accessToken || !expiresIn)
    return next(
      new AppError(
        'Token response data must contain access token, refresh token and expires in.',
        400,
      ),
    );
  try {
    const doctor = await Doctor.findById(doctorID);
    if (!doctor)
      return next(new AppError('No doctor found with this ID.', 404));
    const calendar = {
      accessToken,
      // refreshToken,
      accessTokenExpiry: Date.now() + expiresIn * 1000, // 1 hour
    };
    doctor.calendar = calendar;
    await doctor.save();

    console.log('✅ Doctor updated successfully.', doctor);
  } catch (err) {
    console.error('❌ Error updating Doctor.', err);
    return next(
      new AppError(
        'Internal Error. Something went wrong while updating the Doctor.',
        500,
      ),
    );
  }
  return accessToken;
});

exports.createCalendar = catchAsync(async (req, res, next) => {
  const accessToken = await getAccessToken(req, next);

  const calendarData = {
    calendarData: {
      name: 'docpatient-nexus-calendar',
      color: '#005a6f',
      textcolor: '#FFFFFF',
      include_infreebusy: true,
      private: 'enable',
      public: 'freeBusy',
      timezone: 'Asia/Dhaka',
      description: 'Calendar for DocPatient Nexus application.',
      status: true,
    },
  };

  try {
    const calendar = await axios.post(
      `https://calendar.zoho.com/api/v1/calendars`,
      qs.stringify(calendarData),
      //   JSON.stringify(calendarData),

      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          //   'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache',
        },
      },
    );
    console.log(calendar);
    res.redirect('https://calendar.zoho.com/zc/wk');
  } catch (err) {
    console.error('❌ Error creating calendar.', err.response.data);
    return next(
      new AppError(
        'Internal Error. Something went wrong while creating the calendar.',
        500,
      ),
    );
  }
});
