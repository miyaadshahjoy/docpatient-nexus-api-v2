const responses = require('../components/responses');

module.exports = {
  paths: {
    '/api/v2/appointments': {
      get: {
        summary: 'Get all appointments',
        tags: ['Appointments'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        description: `Allows an Admin( Appointment Manager ) to get all appointments details. Requires a valid *JWT* token with **Admin** privileges to access this route.`,
        operationId: 'getAllAppointments',
        parameters: [],
        responses: {
          200: {
            description: 'Successfully fetched all appointments.',
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
                        appointments: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Appointment' },
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
              'Unauthorized access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
                        'You are not authorized to access this route. Please log in with an Admin( Appointment Manager ) account.',
                    },
                  },
                },
              },
            },
          },
          403: {
            description:
              'Forbidden access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
              'No appointments found matching the provided criteria.',
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
                      example: 'No appointments found.',
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

    '/api/v2/appointments/{id}': {
      get: {
        tags: ['Appointments'],
        summary: 'Get an appointment by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows the Admin( Appointment Manager ) to access a specific appointment by its ID. Requires a valid *JWT* token with **Admin**  privileges to access this route.',
        operationId: 'getAppointmentById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the appointment to retrieve.',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
          },
        ],
        responses: {
          200: {
            description: 'Successfully fetched the appointment.',
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
                        'Invalid ID format or missing ID. Please provide a valid appointment ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
                      example:
                        'No appointment found with the provided ID. Please check the ID and try again.',
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
        tags: ['Appointments'],
        summary: 'Update an Appointment by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description: `
Allows an Admin( Appointment Manager ) to update an specific Appointment by its ID. Requires a valid *JWT* token with **Admin**  privileges to access this route.

## Request Body:

- **appointmentDate**: *date*
  - Description: The date of the appointment.
  - Format: YYYY-MM-DD (ISO 8601 Date Format)
  - Example: '2022-01-01'

- **appointmentSchedule**: *object*
  - Description: The schedule of the appointment.
  - Example:
  \`\`\`json
  {
    "day": "monday", 
    "hours": { 
      "from": "08:00", 
      "to": "17:00" 
    } 
  }
  \`\`\`

- **reason**: *string*
  - Description: The reason for the appointment.
  - Example: 'Check-up'

- **notes**: *string*
  - Description: Additional notes for the appointment.
  - Example: 'Patient advised to continue medications for 7 days and return for follow-up if symptoms persist.'

- **consultationType**: *string*
  - Description: The type of consultation.
  - Example: 'in-person'

- **paymentMethod**: *string*
  - Description: The payment method for the appointment.
  - Example: 'card'

- **paymentIntent**: *string*
  - Description: The payment intent for the appointment.
  - Example: 'payment_intent_1234567890'

- **paymentStatus**: *string*
  - Description: The payment status for the appointment.
  - Example: 'paid'

- **isPrescribed**: *boolean*
  - Description: Whether the appointment is prescribed or not.
  - Example: true

- **status**: *string*
  - Description: The status of the appointment.
  - Example: 'confirmed'
`,

        operationId: 'updateAppointmentById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the appointment to update.',
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
                  appointmentDate: {
                    type: 'string',
                    format: 'date',
                    example: '2022-01-01',
                  },
                  appointmentSchedule: {
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
                        properties: {
                          from: {
                            type: 'string',
                            format: 'time',
                            example: '08:00',
                          },
                          to: {
                            type: 'string',
                            format: 'time',
                            example: '17:00',
                          },
                        },
                      },
                    },
                  },
                  reason: {
                    type: 'string',
                    example: 'Check-up',
                  },
                  notes: {
                    type: 'string',
                    example: 'No additional notes.',
                  },
                  consultationType: {
                    type: 'string',
                    enum: ['in-person', 'online'],
                    example: 'in-person',
                  },
                  paymentMethod: {
                    type: 'string',
                    enum: ['card', 'cash', 'unknown'],
                    example: 'card',
                  },
                  paymentIntent: {
                    type: 'string',
                    example: 'pi_1HJ2K3L4M5N6O7P8Q9R0S1T2',
                  },
                  paymentStatus: {
                    type: 'string',
                    enum: ['pending', 'paid', 'failed', 'refunded'],
                    example: 'paid',
                  },
                  isPrescribed: {
                    type: 'boolean',
                    example: true,
                  },
                  status: {
                    type: 'string',
                    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
                    example: 'confirmed',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Successfully updated the appointment.',
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
                        'Invalid ID format or missing ID. Please provide a valid appointment ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
                      example:
                        'No appointment found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Delete an Appointment by ID
      delete: {
        tags: ['Appointments'],
        summary: 'Delete an Appointment by ID.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        description:
          'Allows an Admin( Appointment Manager ) to delete a specific appointment by its ID. Requires a valid *JWT* token with **Admin** privileges to access this route.',
        operationId: 'deleteAppointmentById',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'The ID of the appointment to delete.',
            schema: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a', // Replace with a valid appointment ID
            },
          },
        ],
        responses: {
          204: {
            description: 'Successfully deleted the appointment.',
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
                        'Invalid ID format or missing ID. Please provide a valid appointment ID.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Appointment Manager ) can access this route.',
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
                      example:
                        'No appointment found with the provided ID. Please check the ID and try again.',
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
