const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/doctors': {
      get: {
        tags: ['Doctors'],
        summary: 'Get all doctors.',
        description: 'Retrieve a list of all registered doctors',
        operationId: 'getDoctors',

        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: {
              type: 'integer',
              default: 1,
            },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of results per page',
            required: false,
            schema: {
              type: 'integer',
              default: 100,
            },
          },
          {
            name: 'sort',
            in: 'query',
            description:
              'Sort order of the results (e.g., "experience,-averageRating")',
            required: false,
            schema: {
              type: 'string',
              default: '-averageRating',
            },
          },
          {
            name: 'fields',
            in: 'query',
            description:
              'Fields to include in the response (e.g., "fullName,experience,specialization,education,location")',
            required: false,
            schema: {
              type: 'string',
              default:
                'fullName,experience,specialization,education,location,averageRating',
            },
          },
          {
            name: 'experience[gte]',
            in: 'query',
            description:
              'Filter doctors with experience greater than or equal to the specified value',
            required: false,
            schema: {
              type: 'integer',
              default: 0,
            },
          },
          {
            name: 'experience[lte]',
            in: 'query',
            description:
              'Filter doctors with experience less than or equal to the specified value',
            required: false,
            schema: {
              type: 'integer',
              default: 50,
            },
          },
          {
            name: 'averageRating[gte]',
            in: 'query',
            description:
              'Filter doctors with average rating greater than or equal to the specified value',
            required: false,
            schema: {
              type: 'number',
              default: 1,
            },
          },
          {
            name: 'averageRating[lte]',
            in: 'query',
            description:
              'Filter doctors with average rating less than or equal to the specified value',
            required: false,
            schema: {
              type: 'number',
              default: 5,
            },
          },
          {
            name: 'specialization',
            in: 'query',
            description:
              'Filter doctors by specialization (e.g., "Cardiology,Neurology")',
            required: false,
            schema: {
              type: 'string',
              default: '',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully fetched all doctors',
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
                        doctors: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Doctor',
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
          404: {
            description: 'No doctors found matching the provided criteria',
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
                      example: 'No doctors found.',
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
    '/api/v2/doctors/{id}': {
      get: {
        tags: ['Doctors'],
        summary: 'Get a single doctor by ID',
        description: 'Retrieve details of a specific doctor by their ID',
        operationId: 'getDoctorById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the doctor to retrieve',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: "Successfully fetched the doctor's details.",
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
                        doctor: {
                          $ref: '#/components/schemas/Doctor',
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
                        'Invalid ID format or missing ID. Please provide a valid doctor ID.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No doctor found with the provided ID.',
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
                        'No doctor found with the provided ID. Please check the ID and try again.',
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
        tags: ['Doctors'],
        summary: 'Update a Doctor by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Update a specific Doctor by their `ID`. This endpoint is accessible to `logged-in` Admins only.',
        operationId: 'updateDoctorById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the Doctor to update',
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
                  fullName: {
                    type: 'string',
                    example: 'Zarif Hossain',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'zarif.hossain@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+880 1720 111234',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'others', 'prefer not to say'],
                  },
                  profilePhoto: {
                    type: 'string',
                    example: 'https://cdn.example.com/images/zarif.jpg',
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
                  education: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['degree', 'institute'],
                      properties: {
                        degree: {
                          type: 'string',
                          example: 'MBBS',
                        },
                        institute: {
                          type: 'string',
                          example: 'Dhaka Medical College',
                        },
                      },
                    },
                  },
                  specialization: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Cardiology', 'Internal Medicine'],
                  },
                  experience: {
                    type: 'number',
                    example: 10,
                  },
                  averageRating: {
                    type: 'number',
                    example: 4.5,
                  },
                  location: {
                    type: 'object',
                    required: ['type', 'coordinates'],
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
                        example: [90.389, 23.746],
                      },
                      city: {
                        type: 'string',
                        example: 'Dhaka',
                      },
                      address: {
                        type: 'string',
                        example: 'Green Road, Dhaka',
                      },
                    },
                  },
                  visitingSchedule: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day: {
                          type: 'string',
                          enum: [
                            'saturday',
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thursday',
                            'friday',
                          ],
                          example: 'monday',
                        },
                        hours: {
                          type: 'object',
                          required: ['from', 'to'],
                          properties: {
                            from: {
                              type: 'string',
                              example: '09:00',
                            },
                            to: {
                              type: 'string',
                              example: '17:00',
                            },
                          },
                        },
                      },
                    },
                  },
                  appointmentDuration: {
                    type: 'number',
                    example: 60, // Duration in minutes
                  },
                  consultationFees: {
                    type: 'number',
                    example: 1000, // Fees in local currency
                  },
                  role: {
                    type: 'string',
                    example: 'doctor',
                  },
                  status: {
                    type: 'string',
                    enum: ['active', 'pending', 'removed'],
                    example: 'active',
                  },
                  isVerified: {
                    type: 'boolean',
                    example: true,
                  },
                  isEmailVerified: {
                    type: 'boolean',
                    example: true,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully updated the doctor.',
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
                        doctor: {
                          $ref: '#/components/schemas/Doctor',
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
              'Bad request. Possibly due to invalid ID format or missing `ID`.',
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
                        'Invalid ID format or missing ID. Please provide a valid doctor ID.',
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
                        'You are not authorized to access this resource. Please log in.',
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
            description:
              'No doctor found with the provided ID. Please check the ID and try again.',
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
                        'No doctor found with the provided ID. Please check the ID and try again.',
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
        tags: ['Doctors'],
        summary: 'Delete a doctor by ID',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Delete a specific doctor by their `ID`. This endpoint is accessible to `logged-in` Admins only.',
        operationId: 'deleteDoctorById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the doctor to delete',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted the doctor.',
          },
          400: {
            description:
              'Bad request. Possibly due to invalid ID format or missing `ID`.',
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
                        'Invalid ID format or missing ID. Please provide a valid doctor ID.',
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
                        'You are not authorized to access this resource. Please log in.',
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
            description:
              'No doctor found with the provided ID. Please check the ID and try again.',
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
                        'No doctor found with the provided ID. Please check the ID and try again.',
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

    '/api/v2/doctors/signup': {
      post: {
        tags: ['Doctors'],
        summary: 'Register a new doctor account.',
        description:
          'Allows a new doctor to register by providing necessary credentials and profile details. After registration, you will have to verify you email through the `/api/v2/doctors/email-verification` endpoint. Initially your account will be in a `pending` state. After verification, your account will be `active` and you can log in.',
        operationId: 'signupDoctor',
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
                  'specialization',
                  'experience',
                  'education',
                  'location',
                  'visitingSchedule',
                  'consultationFees',
                ],
                properties: {
                  fullName: {
                    type: 'string',
                    example: 'Zarif Hossain',
                  },
                  email: {
                    type: 'string',
                    example: 'zarif.hossain@example.com',
                  },
                  phone: {
                    type: 'string',
                    example: '+880 1720 111234',
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'others', 'prefer not to say'],
                    example: 'female',
                  },
                  profilePhoto: {
                    type: 'string',
                    example: 'https://cdn.example.com/images/zarif.jpg',
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
                  specialization: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['Cardiology', 'Internal Medicine'],
                  },
                  experience: {
                    type: 'number',
                    example: 10,
                  },
                  education: {
                    type: 'array',
                    items: {
                      type: 'object',
                      required: ['degree', 'institute'],
                      properties: {
                        degree: {
                          type: 'string',
                          example: 'MBBS',
                        },
                        institute: {
                          type: 'string',
                          example: 'Dhaka Medical College',
                        },
                      },
                    },
                  },
                  location: {
                    type: 'object',
                    required: ['type', 'coordinates'],
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
                        example: [90.389, 23.746],
                      },
                      city: {
                        type: 'string',
                        example: 'Dhaka',
                      },
                      address: {
                        type: 'string',
                        example: 'Green Road, Dhaka',
                      },
                    },
                  },
                  visitingSchedule: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        day: {
                          type: 'string',
                          enum: [
                            'saturday',
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thursday',
                            'friday',
                          ],
                          example: 'monday',
                        },
                        hours: {
                          type: 'object',
                          required: ['from', 'to'],
                          properties: {
                            from: {
                              type: 'string',
                              example: '09:00',
                            },
                            to: {
                              type: 'string',
                              example: '17:00',
                            },
                          },
                        },
                      },
                    },
                  },
                  consultationFees: {
                    type: 'number',
                    example: 1000,
                  },
                  appointmentDuration: {
                    type: 'number',
                    example: 60,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Doctor registered successfully',
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
            description: 'Invalid input or validation failed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example: 'Passwords do not match',
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
    '/api/v2/doctors/signin': {
      post: {
        tags: ['Doctors'],
        summary: 'Doctor Sign In',
        description:
          'Allows a doctor to sign in using email and password. If your email is `not verified`, you will not be able to sign in. Verify your email using the `/api/v2/doctors/email-verification` endpoint. If your account is pending approval by the admin, you will not be able to sign in.<br><br>After successfully logging in use the `jwt` token from the response to authenticate or authorize for accessing protected routes.',
        operationId: 'signinDoctor',
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
                    example: 'zarif.hossain@example.com',
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
            description: 'Doctor signed in successfully',
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
              'Invalid email or password. Please provide valid credentials.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
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
                        'Please verify your email before accessing the system',
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
                        'Your account is pending approval by an admin or has been removed. Please contact support.',
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
    '/api/v2/doctors/email-verification': {
      post: {
        tags: ['Doctors'],
        summary: 'Send email verification link',
        description:
          'Sends an `email verification link` to the doctor’s registered email address. The email address is also sent along with the verification token. Collect the token from the email and use it to verify your email using the `/api/v2/doctors/email-verification/{token}` endpoint. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the `/api/v2/doctors/email-verification` endpoint. <br><br>**Note**: The email verification token could be long. Make sure to copy the entire token from the email.',
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
                    example: 'zarif.hossain@example.com',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Email verification link sent successfully',
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
                    status: { type: 'string', example: 'fail' },
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
            description: 'No doctor found with the provided email address.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'fail' },
                    message: {
                      type: 'string',
                      example:
                        'No doctor found with the provided email address. Please check the email and try again.',
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
    '/api/v2/doctors/email-verification/{token}': {
      patch: {
        tags: ['Doctors'],
        summary: 'Verify doctor’s email.',
        description:
          'Verifies the doctor’s email using the token sent to their email address. Collect the token from the email and use it in the parameters section to verify your email. The verfication token is valid for 10 minutes. After that, the token will expire and you will have to request a new token using the `/api/v2/doctors/email-verification` endpoint.<br><br>**Note**: The email verification token could be long. Make sure to copy the entire token from the email.',
        operationId: 'verifyDoctorEmail',
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
              'No doctor found with the provided token or token does not exist.',
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
    // POST /doctors/patients/{patientId}/records
    '/api/v2/doctors/patients/{patientId}/records': {
      post: {
        tags: ['Doctors'],
        summary: 'Create a patient-record for a patient.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          'Allows a doctor to `create a patient-record` for a patient. A doctor must be `logged in` to use this route.',
        operationId: 'createPatientRecord',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            description: 'ID of the patient to create a patient-record for.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          type: 'object',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  allergies: {
                    type: 'array',
                    example: ['Peanuts', 'Penicillin'],
                  },
                  conditions: {
                    type: 'array',
                    example: ['Hypertension', 'Type 2 Diabetes'],
                  },
                  surgeries: {
                    type: 'array',
                    example: [
                      'Appendectomy (2010)',
                      'Gallbladder removal (2016)',
                    ],
                  },
                  familyHistory: {
                    type: 'array',
                    example: [
                      'Father - Heart disease',
                      'Mother - Type 2 Diabetes',
                    ],
                  },
                  lifestyle: {
                    type: 'object',
                    properties: {
                      badHabits: {
                        type: 'array',
                        example: ['smoking'],
                      },
                      exercise: {
                        type: 'string',
                        example: 'moderate',
                      },
                    },
                  },
                  medications: {
                    type: 'array',
                    example: [
                      '64fc8e27b12d5a9cfdcdef20',
                      '64fc8e27b12d5a9cfdcdef21',
                    ],
                  },
                  reports: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: {
                          type: 'string',
                          example: 'Blood Test Report',
                        },
                        fileUrl: {
                          type: 'string',
                          example:
                            'https://example.com/reports/bloodtest_jan2025.pdf',
                        },
                        issuedBy: {
                          type: 'string',
                          example: 'Dr. Nafisa Rahman',
                        },
                        issuedOn: {
                          type: 'string',
                          example: '2025-01-15T00:00:00.000Z',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Patient record created successfully.',
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
                      example: 'Patient record created successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patientRecord: {
                          $ref: '#/components/schemas/PatientRecord',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request. Possibly due to invalid input.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error',
                    },
                    message: {
                      type: 'string',
                      example: 'Record already exists for this patient.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only `logged-in Doctors` can access this route. Log in with a valid `jwt` token.',
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
                        'Unauthorized access. Please log in to continue.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only `logged-in Doctors` can access this route.',
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
      // PATCH/doctors/patients/{patientId}/records
      patch: {
        tags: ['Doctors'],
        summary: 'Update a patient-record for a patient.',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          'Allows a doctor to `update a patient-record` for a patient. A doctor must be `logged in` to use this route.<br><br>**Note:** In order to update a patient-record, the patient must have an existing patient-record. A patient-record can be created by a doctor using the `/doctors/patients/{patientId}/records` route.',
        operationId: 'updatePatientRecord',
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            description: 'ID of the patient to update a patient-record for.',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Hematology Analysis Report',
                  },
                  issuedBy: {
                    type: 'string',
                    example: 'Dr. Nafisa Rahman',
                  },
                  issuedOn: {
                    type: 'string',
                    formate: 'date-time',
                    example: '2025-06-02T17:49:00+06:00',
                  },
                  record: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Patient record updated successfully.',
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
                      example: 'Patient report uploaded successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        patientRecord: {
                          $ref: '#/components/schemas/PatientRecord',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request. Possibly due to invalid input.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'error',
                    },
                    message: {
                      type: 'string',
                      example: 'Missing required fields in request body.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only `logged-in Doctors` can access this route. Log in with a valid `jwt` token.',
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
                        'Unauthorized access. Please log in to continue.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only `logged-in Doctors` can access this route.',
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
                      example: 'No record found for this patient.',
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

    // POST/doctors/appointments/{appointmentId}/prescription
    '/api/v2/doctors/appointments/{appointmentId}/prescription/': {
      post: {
        tags: ['Doctors'],
        summary: 'Create a prescription for an appointment',
        security: [
          {
            bearerAuth: [],
          },
        ],
        description:
          'Allows a doctor to `create a prescription` for an appointment. A doctor must be `logged in` to use this route.',
        operationId: 'createPrescription',
        parameters: [
          {
            name: 'appointmentId',
            in: 'path',
            description: 'ID of the appointment to create a prescription for.',
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
                required: ['medications'],
                properties: {
                  notes: {
                    type: 'string',
                    example:
                      'Patient advised to continue medications for 7 days and return for follow-up if symptoms persist.',
                  },
                  medications: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Medication',
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Prescription created successfully.',
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
                      example: 'Prescription created successfully.',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request. Possibly due to invalid input.',
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
                        'Prescription already exists for this appointment.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only `logged-in Doctors` can access this route. Log in with a valid `jwt` token.',
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
              'Forbidden access. Only `logged-in Doctors` can access this route.',
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
                        'You do not have the permission to perform this action.',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'No appointment found with the provided ID.',
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
                      example: 'No appointment found with the provided ID.',
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
