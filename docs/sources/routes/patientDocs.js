const responses = require('../components/responses');

/*
{
    "fullName": "Farzana Nahar",
    "email": "farzana.nahar92@example.com",
    "phone": "+8801745123456",
    "gender": "female",
    "profilePhoto": "https://example.com/uploads/farzana.jpg",
    "password": "SafePass123!", 
    "passwordConfirm": "SafePass123!",
    "bloodGroup": "O+",
    "dateOfBirth": "1992-03-15T00:00:00.000Z",
    "medicalHistory": [
      "Diabetes Type 2",
      "Migraines"
    ],
    "allergies": [
      "Penicillin",
      "Dust"
    ],
    "currentMedications": [
      "Metformin",
      "Paracetamol"
    ],
    "location": {
      "city": "Chattogram",
      "address": "House #22, Road #5, Nasirabad"
    },
    "status": "active",
    "role": "patient",
    "isVerified": true,
    "emailVerified": true,
    "passwordChangedAt": "2024-11-01T10:00:00.000Z",
    "passwordResetToken": "e3c8fd0abf1a4d12ac9be1e4bdf2f630",
    "passwordResetExpires": "2025-06-15T12:00:00.000Z",
    "emailVerificationToken": "v3r1fyT0k3n2025",
    "emailVerificationExpires": "2025-06-14T23:59:00.000Z",
    "createdAt": "2025-06-13T10:00:00.000Z",
    "updatedAt": "2025-06-13T10:00:00.000Z"
          }
          */
module.exports = {
  paths: {
    // Patient signup route
    '/api/v2/patients/signup': {
      post: {
        tags: ['Patients'],
        summary: 'Register a new Patient account.',
        description: `
Allows a new Patient to register by providing necessary credentials and profile details. After registration, you will have to **verify** your **email** through the **/api/v2/patients/email-verification** endpoint. Initially your account will be in a **pending** state. After **verification** or **approval**(by the Admin), your account will be **active** and you can log in.<br><br>

## Request Body:

- **fullName**: *string*, *required*
  - Description: Full name of the Patient.
  - Example: Farzana Nahar

- **email**: *string*, *required*
  - Description: Email address of the Patient.
  - Example: farzana.nahar@example.com

- **phone**: *string*, *required*
  - Description: Phone number of the Patient.
  - Example: +8801745123456

- **gender**: *string*, *required*
  - Description: Gender of the Patient.
  - Example: female

- **dateOfBirth**: *date*, *required*
  - Description: Date of birth of the Patient.
  - Example: 1992-03-15

- **location**: *object*, *required*
  - Description: Location of the Patient.
  - Example: 
  \`\`\`json
  { 
    city: "Chattogram", 
    address: "House #22, Road #5, Nasirabad" 
  }
  \`\`\`

- **bloodGroup**: *string*, *required*
  - Description: Blood group of the Patient.
  - Allowed values: A+, B+, O+, A-, B-, O-, AB+, AB-
  - Example: O+

- **profilePhoto**: *string*, *optional*
  - Description: Profile photo of the Patient.
  - Example: https://example.com/uploads/farzana.jpg

- **password**: *string*, *required*
  - Description: Password of the Patient.
  - Example: pass1234

- **passwordConfirm**: *string*, *required*
  - Description: Confirm password of the Patient.
  - Example: pass1234

- **medicalHistory**: *array of strings*
  - Description: Medical history of the Patient.
  - Example: ["Diabetes", "Hypertension"]

- **currentMedications**: *array of strings*
  - Description: Current medications of the Patient.
  - Example: ["Metformin", "Aspirin"]
`,
        operationId: 'signupPatient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'fullName',
                  'email',
                  'phone',
                  'gender',
                  'dateOfBirth',
                  'location',
                  'bloodGroup',
                  'password',
                  'passwordConfirm',
                ],
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Farzana Nahar',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+8801745123456',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'others', 'prefer not to say'],
                    example: 'female',
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '1992-03-15',
                  },
                  location: {
                    type: 'object',
                    properties: {
                      city: {
                        type: 'string',
                        example: 'Chattogram',
                      },
                      address: {
                        type: 'string',
                        example: 'House #22, Road #5, Nasirabad',
                      },
                    },
                  },
                  bloodGroup: {
                    type: 'string',
                    enum: ['A+', 'B+', 'O+', 'A-', 'B-', 'O-', 'AB+', 'AB-'],
                    example: 'O+',
                  },
                  profilePhoto: {
                    type: 'string',
                    example: 'https://example.com/uploads/farzana.jpg',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                  passwordConfirm: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Diabetes', 'Hypertension'],
                  },
                  currentMedications: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Metformin', 'Aspirin'],
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Patient registered successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: {
                          $ref: '#/components/schemas/Patient',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'Passwords do not match.',
                    },
                  },
                },
              },
            },
          },
          409: {
            description: 'Email or phone number already in use.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Email already exists. Please use a different email.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Patient signin route
    '/api/v2/patients/signin': {
      post: {
        tags: ['Patients'],
        summary: 'Patient Sign In',
        description: `
Allows a Patient to **signin** using **email** and **password**.After sigining in, use the **jwt** token from the response to authenticate or authorize for accessing protected routes. <br><br>**Note:** In order to signin as a Patient you have to verify your email after signing up and get your account approved by the Admin.<br><br><blockquote><span>❗</span><p>All the protected routes have the 🔓 icon at the top right corner.</p></blockquote><br><br>

## Request Body:

- **email**: *string*, *required*
  - Description: Email address of the Patient.
  - Example: farzana.nahar@example.com

- **password**: *string*, *required*
  - Description: Password of the Patient.
  - Example: pass1234
`,
        operationId: 'signinPatient',
        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Patient signed in successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    token: {
                      type: 'string',
                      example: 'JWT token here.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: {
                          $ref: '#/components/schemas/Patient',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Invalid email or password. Please provide valid credentials.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'Enter correct email and password to sign in.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized access.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Please verify your email before accessing the system.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Forbidden access due to account status.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Your account is pending approval by an Admin or has been removed. Please contact support.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },

    // Sending email verification link route
    '/api/v2/patients/email-verification': {
      post: {
        tags: ['Patients'],
        summary: 'Send email verification link',
        description: `
Sends an **email verification link** to the Patient’s registered email address. The email address is also sent along with the verification token. Collect the token from the email and use it to verify your email using the **/api/v2/patients/email-verification/{token}** endpoint. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/patients/email-verification** endpoint.<br><br>

## Request Body:

- **email**: *string*, *required*
  - Description: Email address of the Patient.
  - Example: farzana.nahar@example.com

`,
        operationId: 'sendEmailVerification',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email verification link sent successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Email verification link sent successfully. Please check your inbox.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid email format or missing email.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid email format or missing email. Please provide a valid email address.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Patient found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'No Patient found with the provided email address. Please check the email and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Email verification route
    '/api/v2/patients/email-verification/{token}': {
      patch: {
        tags: ['Patients'],
        summary: 'Verify Patient’s email.',
        description:
          'Verifies the Patient’s email using the token sent to their email address. Collect the token from the email and use it in the parameters section to **verify** your email. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/patients/email-verification** endpoint.',
        operationId: 'verifyPatientEmail',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            description: 'Email verification token',
            schema: {
              type: 'string',
              example: 'verification-token-here',
            },
          },
        ],
        responses: {
          200: {
            description: 'Email verified successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Email verified successfully.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid or expired token.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'Invalid or expired email verificaion token. Please request a new verification link.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description:
              'No Patient found with the provided token or token does not exist.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example: 'No verfication token found.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Forgot password route
    '/api/v2/patients/forgot-password': {
      post: {
        tags: ['Patients'],
        summary: 'Request password reset link.',
        description: `
Sends a password reset link to the Patient's email address. The Patient just have to provide their registered email address. The **password reset link** will be sent to their email address. The link contains a **token** that will be used to reset the password through the **/api/v2/patients/reset-password/{token}** endpoint. The token is valid for only 10 minutes.<br><br>

## Request Body:

- **email**: *string*, *required*
  - Description: Email address of the Patient.
  - Example: farzana.nahar@example.com

`,
        operationId: 'requestPasswordReset',
        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email'],
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset link sent successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Password reset link sent to your email.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid email format or missing email.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid email format. Please provide a valid email address.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Patient found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No Patient found with this email address',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Reset password route
    '/api/v2/patients/reset-password/{resetToken}': {
      post: {
        tags: ['Patients'],
        summary: 'Reset Patient password.',
        description: `
Allows Patient to reset their password using the **token** sent to their email address. The token is valid for only 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/patients/forgot-password** endpoint. The Patient must provide a new password and confirm it.<br><br>

## Request Body:

- **password**: *string*, *required*
  - Description: New password of the Patient.
  - Example: pass1234

- **passwordConfirm**: *string*, *required*
  - Description: Confirm new password of the Patient.
  - Example: pass1234
`,
        operationId: 'resetPatientPassword',
        parameters: [
          {
            name: 'resetToken',
            in: 'path',
            required: true,
            description: 'Password reset token',
            schema: {
              type: 'string',
              example: 'reset-token-here',
            },
          },
        ],
        requestBody: {
          required: true,

          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'passwordConfirm'],
                properties: {
                  password: {
                    type: 'string',
                    example: 'pass1234',
                  },
                  passwordConfirm: {
                    type: 'string',
                    example: 'pass1234',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Password reset successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Password has been reset successfully.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Invalid input. Please provide a valid password and confirm password.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid password reset token or token has expired.',
                    },
                  },
                },
              },
            },
          },

          500: responses.InternalServerError,
        },
      },
    },
    // Get all patients route
    '/api/v2/patients': {
      // Only logged in Admins or Doctors can access this route
      get: {
        tags: ['Patients'],
        summary: 'Get all Patients',

        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          ' This endpoint allows **logged-in** Admins or Doctors to retrieve all the registered patients in the system.',
        operationId: 'getPatients',

        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            schema: {
              type: 'integer',
              example: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            schema: {
              type: 'integer',
              example: 100,
            },
          },
          {
            name: 'sort',
            in: 'query',
            description:
              'Sort order of the results (e.g., "fullName,email,-dateOfBirth")',
            schema: {
              type: 'string',
              example: '-dateOfBirth',
            },
          },
          {
            name: 'fields',
            in: 'query',
            description:
              'Fields to include in the response (e.g., "fullName,email,gender,dateOfBirth,location")',
            schema: {
              type: 'string',
              example: 'fullName,email,gender,dateOfBirth,location',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully fetched all Patients.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    results: {
                      type: 'integer',
                      example: 3,
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patients: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Patient',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },

          400: {
            description:
              'Bad request. Possibly due to invalid query parameters.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid query parameters provided. Check your request.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins and Doctors can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this resource.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Patients found matching the provided criteria',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No Patients found.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },

    // Get a Patient by ID
    '/api/v2/patients/{id}': {
      get: {
        tags: ['Patients'],
        summary: 'Get a Patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Retrieve details of a specific patient by their **ID**. This endpoint is accessible to **logged-in** Admins or Doctors only.',
        operationId: 'getPatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to retrieve',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully fetched the Patients's details.",
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: {
                          $ref: '#/components/schemas/Patient',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid ID format or missing ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid ID format or missing ID. Please provide a valid patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins or Doctors can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this resource. ',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins or Doctors can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No patient found with the provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'No Patient found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      patch: {
        tags: ['Patients'],
        summary: 'Update a Patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Admin** to update a specific Patient account by their ID. Requires a valid **JWT** token with **Admin** privileges to access this route.',
        operationId: 'updatePatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to update',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Sadia Rahman',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'sadin.rahman@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+8801234567890',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'other', 'prefer not to say'],
                    example: 'male',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/profile-photo.jpg',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                  passwordConfirm: {
                    type: 'string',
                    format: 'password',
                    example: 'pass1234',
                  },
                  bloodGroup: {
                    type: 'string',
                    example: 'O+',
                  },
                  dateOfBirth: {
                    type: 'string',
                    format: 'date',
                    example: '1990-01-01',
                  },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Diabetes, Hypertension, Asthma',
                    },
                  },
                  allergies: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Penicillin, Nuts',
                    },
                  },
                  currentMedications: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Metformin, Lisinopril',
                    },
                  },

                  location: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                        enum: ['Point'],
                        example: 'Point',
                      },
                      coordinates: {
                        type: 'array',
                        items: {
                          type: 'number',
                        },
                        example: [23.8103, 90.4125],
                      },
                      city: {
                        type: 'string',
                        example: 'Dhaka',
                      },
                      address: {
                        type: 'string',
                        example: '123 Main St, Dhaka, Bangladesh',
                      },
                    },
                    status: {
                      type: 'string',
                      enum: ['active', 'pending', 'removed'],
                      example: 'active',
                    },
                    role: {
                      type: 'string',
                      example: 'patient',
                    },
                    isVerified: {
                      type: 'boolean',
                      example: false,
                    },
                    emailVerified: {
                      type: 'boolean',
                      example: false,
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully updated the Patient.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: {
                          $ref: '#/components/schemas/Patient',
                        },
                      },
                    },
                  },
                },
              },
            },
          },

          400: {
            description:
              'Bad request. Possibly due to invalid ID format or missing ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid ID format or missing ID. Please provide a valid Patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in with an Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Patient found with the provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'No patient found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Delete a Patient by ID
      delete: {
        tags: ['Patients'],
        summary: 'Delete a Patient by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Admin** to delete a specific Patient account by their ID. Requires a valid **JWT** token with **Admin** privileges to access this route.',
        operationId: 'deletePatientById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the patient to delete',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted the Patient.',
          },
          400: {
            description:
              'Bad request. Possibly due to invalid ID format or missing ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid ID format or missing ID. Please provide a valid Patient ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in with an Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged in Admins can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Patient found with the provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'No patient found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Get currently logged in patient profile
    '/api/v2/patients/me': {
      get: {
        tags: ['Patients'],
        summary: "Get currently logged-in Patient's profile.",
        description:
          'Fetches the profile information of the currently **logged-in** Patient. The Patient must be logged-in and have a valid **JWT** token. Only **accessible** to **logged-in** Patients.',
        operationId: 'getPatientProfile',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        responses: {
          200: {
            description: 'Patient profile fetched successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'This user does not exist anymore.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Patient must be logged in with a valid JWT token.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      patch: {
        tags: ['Patients'],
        summary: 'Update currently logged-in Patient Profile.',
        description: `
Allows a Patient to **update** their profile information. The Patient must be **logged-in** and have a valid **JWT** token.<br><br>


## Request Body:

- **fullName**: *string*
  - Description: Full name of the Patient.
  - Example: Farzana Nahar

- **email**: *string*
  - Description: Email address of the Patient.
  - Example: farzana.nahar@example.com

- **phone**: *string*
  - Description: Phone number of the Patient.
  - Example: +8801745123456

- **gender**: *string*
  - Description: Gender of the Patient.
  - Example: female

- **dateOfBirth**: *date*
  - Description: Date of birth of the Patient.
  - Example: 1992-03-15

- **location**: *object*
  - Description: Location of the Patient.
  - Example: 
  \`\`\`json
  { 
    city: "Chattogram", 
    address: "House #22, Road #5, Nasirabad" 
  }
  \`\`\`

- **bloodGroup**: *string*
  - Description: Blood group of the Patient.
  - Allowed values: A+, B+, O+, A-, B-, O-, AB+, AB-
  - Example: O+

- **profilePhoto**: *string*
  - Description: Profile photo of the Patient.
  - Example: https://example.com/uploads/farzana.jpg

- **medicalHistory**: *array of strings*
  - Description: Medical history of the Patient.
  - Example: ["Diabetes", "Hypertension"]

- **currentMedications**: *array of strings*
  - Description: Current medications of the Patient.
  - Example: ["Metformin", "Aspirin"]
`,
        operationId: 'updatePatientProfile',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Farzana Nahar',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'farzana.nahar@example.com',
                  },
                  phone: {
                    type: 'String',
                    pattern: '^\\+?[0-9]{10,15}$',
                    example: '+8801745123456',
                  },
                  gender: {
                    type: 'string',
                    example: 'female',
                  },
                  dateOfBirth: {
                    type: 'date',
                    example: '1992-03-15',
                  },
                  location: {
                    type: 'object',
                    properties: {
                      city: {
                        type: 'string',
                        example: 'Chattogram',
                      },
                      address: {
                        type: 'string',
                        example: 'House #22, Road #5, Nasirabad',
                      },
                    },
                  },
                  bloodGroup: {
                    type: 'string',
                    example: 'O+',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/uploads/farzana.jpg',
                  },
                  medicalHistory: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Diabetes',
                    },
                  },
                  currentMedications: {
                    type: 'array',
                    items: {
                      type: 'string',
                      example: 'Metformin',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Patient profile updated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patient: { $ref: '#/components/schemas/Patient' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Bad request. Possibly due to invalid input or validation errors.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid input. Please provide valid profile information.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can update their profile.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'You must be logged in to update your profile.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can update their profile.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to update this profile.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      delete: {
        tags: ['Patients'],
        summary: 'Delete currently logged-in Patient account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows a Patient to **delete** their own account. The Patient must be **logged-in** with a valid **JWT** token.',
        operationId: 'deletePatientAccount',
        responses: {
          204: {
            description: 'Patient account deleted successfully.',
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can delete their account.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'You must be logged in to delete your account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can delete their account.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to delete this account.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Get available visiting hours for a Doctor
    // POST /patients/doctors/{doctorId}/available-visiting-hours
    '/api/v2/patients/doctors/{doctorId}/available-visiting-hours': {
      post: {
        tags: ['Patients'],
        summary: 'Get available visiting hours for a Doctor.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description: `
Get **available visiting hours** for a Doctor. The visiting hours are displayed in 24-hour format. You have to provide a **valid date** to get available visiting hours on the provided date.<br><br>This endpoint is accessible to **logged-in** patients only.<br><br>

## Request Body:

- **date**: *required*
  - Date for which to get available visiting hours.
  - Format: YYYY-MM-DD (ISO 8601 Date Format)
  - Example: 2025-08-01

`,
        operationId: 'getAvailableVisitingHours',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  date: {
                    type: 'string',
                    format: 'date',
                    description:
                      'Date for which to get available visiting hours. Format: YYYY-MM-DD (ISO 8601 Date Format)',
                    example: '2025-08-01',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully retrieved all available visiting hours.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Available visiting time slots retrieved successfully',
                    },
                    /*
  "data": {
    "date": "2025-06-16",
    "visitingDay": "monday",
    "visitingHours": [
      {
        "from": "09:00",
        "to": "09:59",
        "available": true
      },
      {
        "from": "10:00",
        "to": "10:59",
        "available": true
      },
      {
        "from": "11:00",
        "to": "11:59",
        "available": true
      },
      {
        "from": "12:00",
        "to": "12:59",
        "available": true
      },
      {
        "from": "13:00",
        "to": "13:59",
        "available": true
      },
      {
        "from": "14:00",
        "to": "14:59",
        "available": true
      },
      {
        "from": "15:00",
        "to": "15:59",
        "available": true
      },
      {
        "from": "16:00",
        "to": "16:59",
        "available": true
      }
    ]
  }*/
                    data: {
                      type: 'object',
                      properties: {
                        date: {
                          type: 'string',
                          example: '2025-06-16',
                        },
                        visitingDay: {
                          type: 'string',
                          example: 'monday',
                        },
                        visitingHours: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              from: {
                                type: 'string',
                                example: '09:00',
                              },
                              to: {
                                type: 'string',
                                example: '09:59',
                              },
                              available: {
                                type: 'boolean',
                                example: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Invalid date format. Please provide a valid date in YYYY-MM-DD format.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid or passed date. Please provide a valid date',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to access this route.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Doctor found matching the provided ID',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No Doctor found.',
                    },
                  },
                },
                500: responses.InternalServerError,
              },
            },
          },
        },
      },
    },
    // Book an appointment with a Doctor
    // POST /patients/doctors/{doctorId}/book-appointment
    '/api/v2/patients/doctors/{doctorId}/book-appointment': {
      post: {
        tags: ['Patients'],
        summary: 'Book an appointment with a Doctor.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: `
Allows a patient to **book an appointment** with a Doctor. The patient must be **logged in** to use this route. The patient enters a **valid date**, **a valid day**, and an **available time slot** to book an appointment with the Doctor. After booking the appointment, the Patient will need to complete the **payment** using **/api/v2/patients/payments/checkout-session** endpoint to confirm the appointment. After the payment is successful, the appointment will be confirmed and the Patient will receive a confirmation email. The **appointment-manager** admin will receive a notification email to confirm the appointment. The admin can confirm the appointment using **PATCH/api/v2/appointments/{id}** endpoint.<br><br>

## Request Body:

- **appointmentDate**: *date*, *required*
  - Date for which to book an appointment.
  - Format: YYYY-MM-DD (ISO 8601 Date Format)
  - Example: 2025-08-01

- **appointmentSchedule**: *object*, *required*
  - Schedule for the appointment.
  - Example:
  \`\`\`json
  {
    "day": "monday",
    "hours": {
      "from": "09:00",
      "to": "09:59"
    }
  }
  \`\`\`

- **reason**: *string*, *required*
  - Reason for the appointment.
  - Example: "Regular blood pressure check-up and follow-up consultation"

- **notes**: *string*, *optional*
  - Notes for the appointment.
  - Example: "Patient has been advised to bring previous test reports."

- **consultationType**: *string*, *optional*
  - Type of consultation.
  - Example: "in-person"
`,
        operationId: 'bookAppointment',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            description: 'ID of the Doctor to book an appointment with.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        /*
{
  "appointmentDate": "2025-06-16",
  "appointmentSchedule": {
    "day": "monday",
    "hours": {
      "from": "09:00",
      "to": "09:59"
    }
  },
  "reason": "Regular blood pressure check-up and follow-up consultation",
  "notes": "Patient has been advised to bring previous test reports.",
  "consultationType": "in-person"
}      
*/
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  appointmentDate: {
                    type: 'string',
                    example: '2025-06-16',
                  },
                  appointmentSchedule: {
                    type: 'object',
                    properties: {
                      day: {
                        type: 'string',
                        example: 'monday',
                      },
                      hours: {
                        type: 'object',
                        properties: {
                          from: {
                            type: 'string',
                            example: '09:00',
                          },
                          to: {
                            type: 'string',
                            example: '09:59',
                          },
                        },
                      },
                    },
                  },
                  reason: {
                    type: 'string',
                    example:
                      'Regular blood pressure check-up and follow-up consultation',
                  },
                  notes: {
                    type: 'string',
                    example:
                      'Patient has been advised to bring previous test reports.',
                  },
                  consultationType: {
                    type: 'string',
                    example: 'in-person',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Appointment successfully booked.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Appointment booked successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        appointment: {
                          $ref: '#/components/schemas/Appointment',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Invalid date format. Please provide a valid date in YYYY-MM-DD format.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Invalid or passed date. Please provide a valid date',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No Doctor found matching the provided ID',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No Doctor found.',
                    },
                  },
                },

                500: responses.InternalServerError,
              },
            },
          },
        },
      },
    },
    // Cancel appointment
    // PATCH /patients/appointments/{appointmentId}/cancel-appointment
    '/api/v2/patients/appointments/{appointmentId}/cancel-appointment': {
      patch: {
        tags: ['Patients'],
        summary: 'Cancel an appointment.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          'Allows a Patient to **cancel an appointment**. The Patient must be **logged in** to use this route. <br><br>**Note:** The appointment must have a status of **pending** or **confirmed** to be cancelled. Patient can only cancel an appointment 24 hours before the appointment time. Patient will be refunded 100% of the appointment fee if the cancellation is done 24 hours before the appointment time and the appointment was confirmed.',
        operationId: 'cancelAppointment',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            description: 'ID of the appointment to cancel.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Your appointment has been successfully cancelled.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Your appointment has been successfully cancelled and refund is in the process.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request. Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'Appointments can only be cancelled 24 hours in advance.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You do not have permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No appointment found with provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No appointment found.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
    // Post a review for an appointment
    // POST/patients/appointments/{appointmentId}/reviews
    '/api/v2/patients/appointments/{appointmentId}/reviews': {
      post: {
        tags: ['Patients'],
        summary: 'Post a review for an appointment.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description: `
Allows a patient to **post a review** for an appointment. The patient must be **logged in** to use this route.<br><br>**Note:** The appointment must have a status of **completed**. If the appointment is not completed, the patient will not be able to post a review. A patient can only post one review for an appointment.<br><br>

## Request Body:

- **review**: *string*, *required*
  - Review for the appointment.
  - Example: "The Doctor was very attentive and explained everything clearly. I felt genuinely cared for during my consultation."

- **rating**: *number*, *required*
  - Rating for the appointment.
  - Example: 5
`,
        operationId: 'postReview',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            description: 'ID of the appointment to post a review for.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  review: {
                    type: 'string',
                    example:
                      'The Doctor was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.',
                  },
                  rating: {
                    type: 'number',
                    example: 5,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Review posted successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Review created successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        review: {
                          $ref: '#/components/schemas/Review',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'Validation failed.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can access this route. ',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'You are not allowed to post a review here.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No appointment found with provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No appointment found.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      patch: {
        tags: ['Patients'],
        summary: 'Update the review for an appointment.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description: `
Allows a Patient to **update the review** for an appointment. The Patient must be **logged in** to use this route.<br><br>

## Request Body:

- **review**: *string*, *required*
  - Review for the appointment.
  - Example: "The Doctor was very attentive and explained everything clearly. I felt genuinely cared for during my consultation. The follow-up was also excellent."

- **rating**: *number*, *required*
  - Rating for the appointment.
  - Example: 5
`,
        operationId: 'updateReview',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            description: 'ID of the appointment to update the review for.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  review: {
                    type: 'string',
                    example:
                      'The Doctor was very attentive and explained everything clearly. I felt genuinely cared for during my consultation. The follow-up was also excellent.',
                  },
                  rating: {
                    type: 'number',
                    example: 4.9,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Review updated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    message: {
                      type: 'string',
                      example: 'Review updated successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        review: {
                          $ref: '#/components/schemas/Review',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'Validation failed.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Patients can access this route. ',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example:
                        'You are not authorized to access this route. Please log in.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Patients can access this route.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'You are not allowed to update the review.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No appointment found with provided ID.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
                    message: {
                      type: 'string',
                      example: 'No appointment found.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
    },
  },
};
