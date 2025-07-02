const responses = require('../components/responses');

/*
{
  "status": "success",
  "message": "Checkout session created successfully",
  "data": {
    "session": {
      "id": "cs_test_a15j3Mq8p9KIXYIHUob4TiPEf1vJZZdIvLB2XBubeTMhU3Ig44on4WBhn2",
      "object": "checkout.session",
      "adaptive_pricing": {
        "enabled": true
      },
      "after_expiration": null,
      "allow_promotion_codes": null,
      "amount_subtotal": 80000,
      "amount_total": 80000,
      "automatic_tax": {
        "enabled": false,
        "liability": null,
        "provider": null,
        "status": null
      },
      "billing_address_collection": null,
      "cancel_url": "http://localhost:3000",
      "client_reference_id": "685448aac7c56b0dac5b39b4",
      "client_secret": null,
      "collected_information": {
        "shipping_details": null
      },
      "consent": null,
      "consent_collection": null,
      "created": 1750424518,
      "currency": "bdt",
      "currency_conversion": null,
      "custom_fields": [],
      "custom_text": {
        "after_submit": null,
        "shipping_address": null,
        "submit": null,
        "terms_of_service_acceptance": null
      },
      "customer": null,
      "customer_creation": "if_required",
      "customer_details": {
        "address": null,
        "email": "farzana.nahar@example.com",
        "name": null,
        "phone": null,
        "tax_exempt": "none",
        "tax_ids": null
      },
      "customer_email": "farzana.nahar@example.com",
      "discounts": [],
      "expires_at": 1750510918,
      "invoice": null,
      "invoice_creation": {
        "enabled": false,
        "invoice_data": {
          "account_tax_ids": null,
          "custom_fields": null,
          "description": null,
          "footer": null,
          "issuer": null,
          "metadata": {},
          "rendering_options": null
        }
      },
      "livemode": false,
      "locale": null,
      "metadata": {},
      "mode": "payment",
      "payment_intent": null,
      "payment_link": null,
      "payment_method_collection": "if_required",
      "payment_method_configuration_details": null,
      "payment_method_options": {
        "card": {
          "request_three_d_secure": "automatic"
        }
      },
      "payment_method_types": [
        "card"
      ],
      "payment_status": "unpaid",
      "permissions": null,
      "phone_number_collection": {
        "enabled": false
      },
      "recovered_from": null,
      "saved_payment_method_options": null,
      "setup_intent": null,
      "shipping_address_collection": null,
      "shipping_cost": null,
      "shipping_options": [],
      "status": "open",
      "submit_type": null,
      "subscription": null,
      "success_url": "http://127.0.0.1:3000",
      "total_details": {
        "amount_discount": 0,
        "amount_shipping": 0,
        "amount_tax": 0
      },
      "ui_mode": "hosted",
      "url": "https://checkout.stripe.com/c/pay/cs_test_a15j3Mq8p9KIXYIHUob4TiPEf1vJZZdIvLB2XBubeTMhU3Ig44on4WBhn2#fid1d2BpamRhQ2prcSc%2FJ1dkaWByZHwnKSdkdWxOYHwnPyd1blpxYHZxWjA0V1c3bkBUQEEzTX1vPVJ8XXxGc2ZVSTxrdmc2djFBbEZ0V0hrSj03M3dkdW80UXVwfVY9NGxof19HXVdTVDRfbXd3dE1PTlNSYENTQ1JoXE9OUmBBf0BmNTVhQ0JmdD1rfycpJ2N3amhWYHdzYHcnP3F3cGApJ2lkfGpwcVF8dWAnPyd2bGtiaWBabHFgaCcpJ2BrZGdpYFVpZGZgbWppYWB3dic%2FcXdwYHgl",
      "wallet_options": null
    }
  }
}
  */

module.exports = {
  paths: {
    '/api/v2/patients/payments/checkout-session': {
      post: {
        tags: ['Payments'],
        summary: 'Create a checkout session for an appointment.',
        security: [
          {
            bearerAuth: [], // This indicates that the endpoint requires authentication
          },
        ],
        operationId: 'createCheckoutSession',
        description:
          'Allows a patient to create a checkout session for an appointment. The patient must be `logged in` to use this route. Log in with a valid `jwt` token.',

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['appointment'],
                properties: {
                  appointment: {
                    type: 'string',
                    example: '64b8e3b9c1b2c4b8e3b9c1b2',
                  },
                },
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Checkout session created successfully',
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
                      example: 'Checkout session created successfully',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        session: {
                          type: 'object',
                          properties: {
                            id: {
                              type: 'string',
                              example:
                                'cs_test_a15j3Mq8p9KIXYIHUob4TiPEf1vJZZdIvLB2XBubeTMhU3Ig44on4WBhn2',
                            },
                            object: {
                              type: 'string',
                              example: 'checkout.session',
                            },
                            amount_subtotal: {
                              type: 'integer',
                              example: 80000,
                            },
                            amount_total: {
                              type: 'integer',
                              example: 80000,
                            },
                            currency: {
                              type: 'string',
                              example: 'bdt',
                            },
                            customer_email: {
                              type: 'string',
                              example: 'farzana.nahar@example.com',
                            },
                            client_reference_id: {
                              type: 'string',
                              description: 'The appointment ID',
                            },
                            cancel_url: {
                              type: 'string',
                              format: 'uri',
                              example: 'http://localhost:3000',
                            },
                            success_url: {
                              type: 'string',
                              format: 'uri',
                              example: 'http://127.0.0.1:3000',
                            },
                            expires_at: {
                              type: 'integer',
                              description:
                                'Unix timestamp of session expiration',
                              example: 1750510918,
                            },
                            livemode: {
                              type: 'boolean',
                              example: false,
                            },
                            mode: {
                              type: 'string',
                              example: 'payment',
                            },
                            payment_status: {
                              type: 'string',
                              example: 'unpaid',
                            },
                            payment_method_types: {
                              type: 'array',
                              items: { type: 'string' },
                              example: ['card'],
                            },
                            url: {
                              type: 'string',
                              format: 'uri',
                              description: 'Stripe-hosted checkout URL',
                              example:
                                'https://checkout.stripe.com/c/pay/cs_test_a15j3Mq8p9KIXYIHUob4TiPE...',
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
            description: 'Bad Request. Invalid appointment ID.',
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
                      example: 'This appointment has already been paid for.',
                    },
                  },
                },
              },
            },
          },
          401: {
            description:
              'Unauthorized access. Only logged-in patients can access this route. Log in with a valid `jwt` token.',
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
              'Forbidden access. Only logged-in patients can access this route.',
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
            description: 'Appointment not found.',
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
                      example: 'No appointment is booked with this ID',
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
