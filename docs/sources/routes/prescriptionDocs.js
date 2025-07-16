const responses = require('../components/responses');

module.exports = {
  paths: {
    // Get all prescriptions for a Patient
    // GET /api/v2/patients/{patientId}/prescriptions
    '/api/v2/patients/{patientId}/prescriptions': {
      get: {
        tags: ['Prescriptions'],
        summary: 'Get all prescriptions for a Patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            description: 'ID of the Patient to get prescriptions for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to retrieve all prescriptions for a specific Patient. This endpoint is secured and requires a valid *JWT* token and Admin (Prescription Manager) privileges to access this route.',
        operationId: 'getPatientPrescriptions',
        responses: {
          200: {
            description:
              'Successfully retrieved all prescriptions for the Patient.',
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
                        prescriptions: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Prescription',
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
              'Unauthorized access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
    },

    '/api/v2/patients/{patientId}/prescriptions/{prescriptionId}': {
      // Get one single prescription by ID for a patient
      // GET /api/v2/patients/{patientId}/prescriptions/{prescriptionId}/

      get: {
        tags: ['Prescriptions'],
        summary: 'Get one single prescription by ID for a Patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            description: 'ID of the Patient to get prescriptions for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'prescriptionId',
            in: 'path',
            required: true,
            description: 'ID of the prescription to get',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to retrieve a specific prescription for a specific Patient. This endpoint is secured and requires a valid *JWT* token and Admin (Prescription Manager) privileges to access this route.',
        operationId: 'getPrescriptionById',
        responses: {
          200: {
            description: 'Successfully retrieved the prescription.',
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
                      example: 'Prescription retrieved successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        prescription: {
                          $ref: '#/components/schemas/Prescription',
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
              'Unauthorized access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
      // Update one signle prescription for a Patient
      // PATCH /api/v2/patients/{patientId}/prescriptions/{prescriptionId}
      patch: {
        tags: ['Prescriptions'],
        summary: 'Update one single prescription for a Patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            description: 'ID of the Patient to get prescription for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'prescriptionId',
            in: 'path',
            required: true,
            description: 'ID of the prescription to update',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to update a specific prescription for a specific Patient. This endpoint is secured and requires a valid *JWT* token and Admin (Prescription Manager) privileges to access this route.',
        operationId: 'updatePrescriptionById',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    example: 'deleted',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Successfully updated the prescription.',
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
                      example: 'Prescription updated successfully.',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        prescription: {
                          $ref: '#/components/schemas/Prescription',
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
              'Unauthorized access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
      // Delete one single prescription for a Patient
      // DELETE /api/v2/patients/{patientId}/prescriptions/{prescriptionId}
      delete: {
        tags: ['Prescriptions'],
        summary: 'Delete one single prescription for a Patient',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'patientId',
            in: 'path',
            required: true,
            description: 'ID of the Patient to get prescription for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'prescriptionId',
            in: 'path',
            required: true,
            description: 'ID of the prescription to delete',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to delete a specific prescription for a specific Patient. This endpoint is secured and requires a valid *JWT* token and Admin (Prescription Manager) privileges to access this route.',
        operationId: 'deletePrescriptionById',
        responses: {
          204: {
            description: 'Successfully deleted the prescription.',
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
              'Unauthorized access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Prescription Manager ) can access this route.',
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
    },
  },
};
