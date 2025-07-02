const responses = require('../components/responses');

/*{
  "fullName": "Ahsan Habib",
  "email": "ahsan.habib@example.com",
  "phone": "+8801712345678",
  "gender": "male",
  "profilePhoto": "https://example.com/photos/ahsan_habib.jpg",
  "password": "pass1234",
  "passwordConfirm": "pass1234",
  "role": "admin",
  "isVerified": false,
  "status": "pending",
  "emailVerified": false,
  "passwordChangedAt": "2025-06-02T14:20:00.000Z",
  "passwordResetToken": null,
  "passwordResetExpires": null,
  "emailVerificationToken": null,
  "emailVerificationExpires": null,
  "createdAt": "2025-06-02T14:20:00.000Z",
  "updatedAt": "2025-06-02T14:20:00.000Z"
}*/

module.exports = {
  paths: {
    '/api/v2/admins/signup': {
      post: {
        tags: ['Admins'],
        summary: 'Register a new Admin account.',
        description:
          'Allows a new Admin to register by providing necessary credentials and profile details. After registration, you will have to **verify** your **email** through the **/api/v2/admins/email-verification** endpoint. Initially your account will be in a **pending** state. After **verification** or **approval**(by the Super-Admin), your account will be **active** and you can log in.',
        operationId: 'signupAdmin',
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
                  'password',
                  'passwordConfirm',
                ],
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Ahsan Habib',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'ahsan.habib@example.com',
                  },
                  phone: {
                    type: 'string',
                    pattern: '^\\+?[0-9]{10,15}$',
                    example: '+8801712345678',
                  },
                  gender: {
                    type: 'string',
                    example: 'male',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/photos/ahsan_habib.jpg',
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
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Admin registered successfully.',
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
                        admin: { $ref: '#/components/schemas/Admin' },
                      },
                    },
                  },
                },
              },
            },
          },

          400: {
            description: 'Invalid input or validation failed.',
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
    '/api/v2/admins/signin': {
      post: {
        tags: ['Admins'],
        summary: 'Admin signin',
        description: `Allows an admin to **signin** using **email** and **password**. After signing in, use the **jwt** token from the response to authenticate or authorize for accessing protected routes.<br><br>**Note:** In order to signin as an Admin you have to verify your email after signing up and get your account approved by the Super-Admin.<br><br><blockquote><span>ℹ</span><p>All the protected routes have the 🔓 icon at the top right corner.</p>`,

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
                    example: 'ahsan.habib@example.com',
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
            description: 'Admin signed in successfully.',
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
                      example: 'JWT token here',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        admin: { $ref: '#/components/schemas/Admin' },
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
                        'Your account is pending approval by a Super-Admin or has been removed. Please contact support.',
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

    // Sending email verification link
    '/api/v2/admins/email-verification': {
      post: {
        tags: ['Admins'],
        summary: 'Send email verification link',
        description: `Sends an **email verification link** to the Admins’s registered email address. The email address is also sent along with the verification token. Collect the token from the email and use it to verify your email using the **/api/v2/admins/email-verification/{token}** endpoint. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/admins/email-verification** endpoint.`,
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
                    example: 'asif.hossain@example.com',
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
            description: 'No Admin found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'No Admin found with the provided email address. Please check the email and try again.',
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
    '/api/v2/admins/email-verification/{token}': {
      patch: {
        tags: ['Admins'],
        summary: 'Verify Admin’s email.',
        description:
          'Verifies the Admin’s email using the **token** sent to their email address. Collect the token from the email and use it in the parameters section to **verify** your email. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/admins/email-verification** endpoint.',
        operationId: 'verifyAdminEmail',
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
                    status: {
                      type: 'string',
                      example: 'fail',
                    },
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
              'No admin found with the provided token or token does not exist.',
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
                      example: 'No verification token found.',
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
    '/api/v2/admins/forgot-password': {
      post: {
        tags: ['Admins'],
        summary: 'Request password reset link.',
        description:
          "Sends a password reset link to the Admin's email address. The Admin just have to provide their registered email address. The **password reset link** will be sent to their email address. The link contains a **token** that will be used to reset the password through the **/api/v2/admins/reset-password/{token}** endpoint. The token is valid for only 10 minutes.",
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
                    example: 'ahsan.habib@example.com',
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
                      example:
                        'Password reset link has been sent to your email.',
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
            description: 'No Admin found with the provided email address.',
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
                      example: 'No Admin found with this email address.',
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
    '/api/v2/admins/reset-password/{token}': {
      post: {
        tags: ['Admins'],
        summary: 'Reset Admin password.',
        description:
          'Allows Admin to reset their password using the **token** sent to their email address. The token is valid for only 10 minutes. After that, the token will expire and you will have to request a new token using the **/api/v2/admins/forgot-password** endpoint. The Admin must provide a new password and confirm it.',
        operationId: 'resetAdminPassword',
        parameters: [
          {
            name: 'token',
            in: 'path',
            required: true,
            description: 'Password reset token',
            schema: {
              type: 'string',
              example: 'password-reset-token-here',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['password', 'confirmPassword'],
                properties: {
                  password: {
                    type: 'string',
                    example: 'newPassword123',
                  },
                  passwordConfirm: {
                    type: 'string',
                    example: 'newPassword123',
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
              'Invalid input. Please provide valid password and confirm password.',
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
                        'Invalid password reset token or token has expired',
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
    // Approve Doctor account
    '/api/v2/admins/approve-doctors/{doctorId}': {
      patch: {
        tags: ['Admins'],
        summary: 'Approve Doctor Account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows an Admin with an **active** and **verified** account to approve a Doctor account by ID. The Doctor account must be in a pending state. Requires a valid **JWT** token with admin privileges to access this route.',
        operationId: 'approveDoctor',
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4f3a',
            },
          },
        ],
        responses: {
          200: {
            description: 'Doctor account approved successfully.',
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
                        doctor: { $ref: '#/components/schemas/Doctor' },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description:
              'Doctor account is already approved or does not exist.',
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
                        'Doctor account is already approved or does not exist.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can approve doctor accounts.',
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
                        "You're not authorized to approve doctor accounts. Please log in with an active and verified admin account.",
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Admins can approve doctor accounts.',
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
          // TODO: Should we add a 404 response here? may be not needed
          404: {
            description: 'Doctor account not found.',
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
                      example: 'No doctor found with the provided ID.',
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

    // Approve Patient account
    '/api/v2/admins/approve-patients/{patientId}': {
      patch: {
        tags: ['Admins'],
        summary: 'Approve Patient account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows an Admin with an **active** and **verified** account to approve a Patient account by ID. The Patient account must be in a pending state. Requires a valid **JWT** token with Admin privileges to access this route.',
        operationId: 'approvePatient',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4f3a',
            },
          },
        ],
        responses: {
          200: {
            description: 'Patient account approved successfully.',
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
              'Patient account is already approved or does not exist.',
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
                        'Patient account is already approved or does not exist.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can approve patient accounts.',
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
                        'You are not authorized to approve patient accounts. Please log in with an active and verified Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Admins can approve patient accounts.',
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
          // TODO: Should we add a 404 response here? may be not needed
          404: {
            description: 'Patient account not found.',
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
                      example: 'No patient found with the provided ID.',
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

    // Get all Admins -> Only the Super-Admin can access these routes
    '/api/v2/admins': {
      get: {
        tags: ['Admins'],
        summary: 'Get all Admins.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Super-Admin**  to access all Admin accounts. Requires a valid **JWT** token with Super-Admin privileges to access this route.',
        responses: {
          200: {
            description: 'Successfully fetched all Admins.',
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
                        admins: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Admin' },
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
              'Unauthorized access. Only logged-in **Super-Admin**  can access this route.',
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
                        'You are not authorized to access this route. Please log in with a Super-Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in **Super-Admin**  can access this route.',
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
            description: 'No Admins found matching the provided criteria.',
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
                      example: 'No Admins found.',
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

    // Get an Admin by ID
    '/api/v2/admins/{id}': {
      get: {
        tags: ['Admins'],
        summary: 'Get an Admin by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Super-Admin**  to access a specific Admin account by their ID. Requires a valid **JWT** token with **Super-Admin**  privileges to access this route.',
        operationId: 'getAdminById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the Admin to retrieve.',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully fetched the Admin.',
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
                        admin: {
                          $ref: '#/components/schemas/Admin',
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
                        'Invalid ID format or missing ID. Please provide a valid Admin ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in **Super-Admin**  can access this route.',
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
                        'You are not authorized to access this route. Please log in with a Super-Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in **Super-Admin** can access this route.',
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
            description: 'No Admin found with the provided ID.',
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
                        'No Admin found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Update an Admin by ID
      patch: {
        tags: ['Admins'],
        summary: 'Update an Admin by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Super-Admin**  to update a specific Admin account by their ID. Requires a valid **JWT** token with **Super-Admin**  privileges to access this route.',
        operationId: 'updateAdminById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the Admin to update.',
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
                $ref: '#/components/schemas/UpdateAdmin',
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully updated the Admin.',
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
                        admin: {
                          $ref: '#/components/schemas/Admin',
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
                        'Invalid ID format or missing ID. Please provide a valid Admin ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Super-Admin can access this route.',
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
                        'You are not authorized to access this route. Please log in with a Super-Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Super-Admin can access this route.',
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
            description: 'No Admin found with the provided ID.',
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
                        'No Admin found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Delete an Admin by ID
      delete: {
        tags: ['Admins'],
        summary: 'Delete an Admin by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the **Super-Admin**  to delete a specific Admin account by their ID. Requires a valid **JWT** token with **Super-Admin**  privileges to access this route.',
        operationId: 'deleteAdminById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the Admin to delete.',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a', // Replace with a valid Admin ID
            },
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted the Admin.',
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
                        'Invalid ID format or missing ID. Please provide a valid Admin ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Super-Admin can access this route.',
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
                        'You are not authorized to access this route. Please log in with a Super-Admin account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Super-Admin can access this route.',
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
            description: 'No Admin found with the provided ID.',
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
                        'No Admin found with the provided ID. Please check the ID and try again.',
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
    // Get currently logged in Admin profile
    '/api/v2/admins/me': {
      get: {
        tags: ['Admins'],
        summary: 'Get currently logged-in Admin profile.',
        description:
          'Fetches the profile information of the currently **logged-in** Admin. The Admin must be logged-in and have a valid **JWT** token. Only **accessible** to **logged-in** Admins.',
        operationId: 'getAdminProfile',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        responses: {
          200: {
            description: 'Admin profile fetched successfully.',
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
                        admin: { $ref: '#/components/schemas/Admin' },
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
              'Unauthorized access. Admin must be logged in with a valid JWT token.',
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
              'Forbidden access. Only logged-in Admins can access this route.',
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
        tags: ['Admins'],
        summary: 'Update currently logged-in Admin Profile.',
        description:
          'Allows an Admin to **update** their profile information. The Admin must be **logged-in** and have a valid **JWT** token.',
        operationId: 'updateAdminProfile',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        /*
        Forbidden fields:
          'specialization',
          'experience',
          'education',
          'averageRating',
          'isVerified',
          'status',
          'role',
         
         */
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Ahsan Habib',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'ahsan.habib@example.com',
                  },
                  phone: {
                    type: 'String',
                    pattern: '^\\+?[0-9]{10,15}$',
                    example: '+8801712345678',
                  },
                  profilePhoto: {
                    type: 'string',
                    format: 'uri',
                    example: 'https://example.com/photos/ahsan_habib.jpg',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Admin profile updated successfully.',
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
                        admin: { $ref: '#/components/schemas/Admin' },
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
              'Unauthorized access. Only **logged-in** Admins can update their profile.',
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
              'Forbidden access. Only **logged-in** Admins can update their profile.',
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
        tags: ['Admins'],
        summary: 'Delete currently logged-in Admin account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows an Admin to **delete** their own account. The Admin must be **logged-in** with a valid **JWT** token.',
        operationId: 'deleteAdminAccount',
        responses: {
          204: {
            description: 'Admin account deleted successfully.',
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can delete their account.',
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
              'Forbidden access. Only logged-in Admins can delete their account.',
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

    // Update currently logged-in Admin password
    '/api/v2/admins/me/password': {
      patch: {
        tags: ['Admins'],
        summary: 'Update currently logged-in Admin password.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows an Admin to **update** their own password. The Admin must be **logged-in** with a valid **JWT** token.',
        operationId: 'updateAdminPassword',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'password', 'passwordConfirm'],
                properties: {
                  currentPassword: {
                    type: 'string',
                    example: 'currentPassword123',
                  },
                  password: {
                    type: 'string',
                    example: 'newPassword123',
                  },
                  passwordConfirm: {
                    type: 'string',
                    example: 'newPassword123',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Admin password updated successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'success',
                    },
                    jwt: {
                      type: 'string',
                      example: 'JWT token here',
                    },
                    message: {
                      type: 'string',
                      example: 'Your password has been updated successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        admin: {
                          type: 'object',
                          properties: {
                            _id: {
                              type: 'string',
                              example: '60c72b2f9b1e8b001c8e4d3a',
                            },
                            name: {
                              type: 'string',
                              example: 'Ahsan Habib',
                            },
                            email: {
                              type: 'string',
                              example: 'ahsan.habib@example.com',
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
              'Bad request. Possibly due to missing or invalid current, new or confirm passwords.',
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
                        'Please provide current, new and confirm passwords.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admins can update their password.',
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
                      example: 'You must be logged in to update your password.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Admins can update their password.',
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
                        'You do not have permission to update your password.',
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
