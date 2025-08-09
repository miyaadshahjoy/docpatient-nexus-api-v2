const responses = require('../components/responses');

module.exports = {
  paths: {
    // Get all reviews for a Doctor
    // GET /api/v2/doctors/{doctorId}/reviews
    '/api/v2/doctors/{doctorId}/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get all reviews for a Doctor',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor to get reviews for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to retrieve all reviews for a specific doctor. This endpoint is secured and requires a valid *JWT* token and Admin (Review Manager) privileges to access this route.',
        operationId: 'getDoctorReviews',
        responses: {
          200: {
            description: 'Successfully retrieved all reviews for the Doctor.',
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
                        reviews: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Review',
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
              'Unauthorized access. Only logged-in Admin( Review Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Review Manager ) can access this route.',
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
            description: 'No Doctor found with the provided ID.',
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
                        'No Doctor found with the provided ID. Please check the ID and try again.',
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
    '/api/v2/doctors/{doctorId}/reviews/{reviewId}': {
      // Get one single review by ID for a Doctor
      // GET /api/v2/doctors/{doctorId}/reviews/{reviewId}/
      get: {
        tags: ['Reviews'],
        summary: 'Get one single review by ID for a Doctor',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor to get reviews for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'reviewId',
            in: 'path',
            required: true,
            description: 'ID of the review to get',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to retrieve a specific review for a specific Doctor. This endpoint is secured and requires a valid *JWT* token and Admin (Review Manager) privileges to access this route.',
        operationId: 'getReviewById',
        responses: {
          200: {
            description: 'Successfully retrieved the review.',
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
                      example: 'Review retrieved successfully.',
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
              'Unauthorized access. Only logged-in Admin( Review Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Review Manager ) can access this route.',
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
            description: 'No Doctor found with the provided ID.',
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
                        'No Doctor found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Update one signle review for a Doctor
      // PATCH /api/v2/doctrs/{doctorId}/reviews/{reviewId}
      patch: {
        tags: ['Reviews'],
        summary: 'Update one single review for a Doctor',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor to get review for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'reviewId',
            in: 'path',
            required: true,
            description: 'ID of the review to update',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description: `
Allows an Admin to update a specific review for a specific Doctor. This endpoint is secured and requires a valid *JWT* token and Admin (Review Manager) privileges to access this route.

## Request Body:

- **isEdited**: *boolean*
  - Description: Whether the review has been edited or not.
  - Example: true

- **status**: *string*
  - Description: The status of the review.
  - Example: 'flagged'
`,
        operationId: 'updateReviewById',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isEdited: {
                    type: 'boolean',
                    example: true,
                  },
                  status: {
                    type: 'string',
                    example: 'flagged',
                  },
                },
              },
            },
          },
        },

        responses: {
          200: {
            description: 'Successfully updated the review.',
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
              'Unauthorized access. Only logged-in Admin( Review Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Review Manager ) can access this route.',
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
            description: 'No Doctor found with the provided ID.',
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
                        'No Doctor found with the provided ID. Please check the ID and try again.',
                    },
                  },
                },
              },
            },
          },
          500: responses.InternalServerError,
        },
      },
      // Delete one single review for a Doctor
      // DELETE /api/v2/doctrs/{doctorId}/reviews/{reviewId}
      delete: {
        tags: ['Reviews'],
        summary: 'Delete one single review for a Doctor',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'doctorId',
            in: 'path',
            required: true,
            description: 'ID of the doctor to get review for',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
          {
            name: 'reviewId',
            in: 'path',
            required: true,
            description: 'ID of the review to delete',
            schema: {
              type: 'string',
              example: '60c72b2f9b1d8c001c8e4f5a',
            },
          },
        ],
        description:
          'Allows an Admin to delete a specific review for a specific Doctor. This endpoint is secured and requires a valid *JWT* token and Admin (Review Manager) privileges to access this route.',
        operationId: 'deleteReviewById',
        responses: {
          204: {
            description: 'Successfully deleted the review.',
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
              'Unauthorized access. Only logged-in Admin( Review Manager ) can access this route.',
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
              'Forbidden access. Only logged-in Admin( Review Manager ) can access this route.',
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
            description: 'No Doctor found with the provided ID.',
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
                        'No Doctor found with the provided ID. Please check the ID and try again.',
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
