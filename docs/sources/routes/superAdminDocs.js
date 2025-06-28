const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/super-admins/signin': {
      post: {
        tags: ['Super-Admins'],
        summary: 'Super-Admin signin.',
        description: `Allows a super-admin to **signin** using **email** and **password**. After sigining in use the **jwt** token to access the protected routes.<br><br><blockquote><span>ℹ</span><p>You cannot create a new Super-Admin account using this api. A system has only one Super-Admin account and it is embedded in the system. You can only login to the Super-Admin account using the email and password provided in the example below. For convenience, I am providing the email and password here. **email: super-admin@docpatientnexus.com** and **password: pass12345**</p>`,
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
                    example: 'super-admin@docpatientnexus.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'pass12345',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Super-Admin signed in successfully.',
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
                        superAdmin: {
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
                      example: 'Enter correct email and password to signin.',
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

    // approve admin accounts
    '/api/v2/super-admins/approve-admins/{adminId}': {
      patch: {
        tags: ['Super-Admins'],
        summary: 'Approve Admin Account.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows a Super-Admin to **approve** an **Admin** account by ID. The Admin must be in a pending state. Requires a valid **JWT** token with Auper-Admin privileges to access this route. ',
        parameters: [
          {
            name: 'adminId',
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
            description: 'Admin account approved successfully.',
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
            description: 'Admin account is already approved or does not exist.',
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
                        'Admin account is already approved or does not exist.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Super-Admins can access this route.',
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
              'Forbidden access. Only logged in Super-Admins can access this route.',
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
                      example: 'You are not allowed to perform this action.',
                    },
                  },
                },
              },
            },
          },
          // TODO: 404 response might be unnecessary here. Might change it later.
          404: {
            description: 'Admin account not found.',
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
                      example: 'No admin found with the provided ID.',
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
