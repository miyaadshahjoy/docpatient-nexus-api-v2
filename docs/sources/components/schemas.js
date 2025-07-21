module.exports = {
  Admin: {
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
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd5',
      },
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
        example: '+8801712345678',
      },
      gender: {
        type: 'string',
        enum: {
          values: ['male', 'female', 'others', 'prefer not to say'],
          message: 'Allowed values: male, female, others, prefer not to say',
        },
        example: 'male',
      },
      profilePhoto: {
        type: 'string',
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
      roles: {
        type: 'array',
        items: {
          type: 'string',
          enum: [
            'admin',
            'super-admin',
            'doctor-manager',
            'patient-manager',
            'appointment-manager',
            'review-manager',
            'notification-manager',
          ],
        },
        default: ['admin'],
        example: ['admin'],
      },
      emailVerified: {
        type: 'boolean',
        example: false,
      },
      isApproved: {
        type: 'boolean',
        example: false,
      },
      status: {
        type: 'string',
        enum: {
          values: ['active', 'pending', 'deleted'],
          message: 'Allowed values: active, pending, deleted',
        },
        example: 'pending',
      },
      deletedBy: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd5',
      },
      deleteAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      passwordChangedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      emailVerificationToken: {
        type: 'string',
        example: 'email-verification-token',
      },
      emailVerificationExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      passwordResetToken: {
        type: 'string',
        example: 'password-reset-token',
      },
      passwordResetExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-02T14:20:00.000Z',
      },
    },
  },
  Doctor: {
    type: 'object',
    required: [
      'fullName',
      'email',
      'phone',
      'gender',
      'location',
      'password',
      'passwordConfirm',
      'education',
      'specialization',
      'visitingSchedule',
      'experience',
      'consultationFees',
    ],

    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd6',
      },
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
        enum: {
          values: ['male', 'female', 'others', 'prefer not to say'],
          message: 'Allowed values: male, female, others, prefer not to say',
        },
        example: 'male',
      },
      location: {
        type: 'object',
        required: ['type', 'coordinates', 'city', 'address'],
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
      profilePhoto: {
        type: 'string',
        example: 'https://cdn.example.com/images/zarif.jpg',
      },
      calendar: {
        $ref: '#/components/schemas/Calendar',
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
              example: 'MBBS, MD, PhD',
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
                  format: 'time',
                  example: '09:00',
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
      },
      appointmentDuration: {
        type: 'number',
        example: 60, // in minutes
      },
      experience: {
        type: 'number',
        example: 10, // in years
      },
      averageRating: {
        type: 'number',
        minimum: 1,
        maximum: 5,
        example: 4.8,
      },
      numRating: {
        type: 'number',
        example: 10,
      },
      consultationFees: {
        type: 'number',
        example: 1000,
      },
      role: {
        type: 'string',
        enum: ['doctor'],
        example: 'doctor',
      },

      emailVerified: {
        type: 'boolean',
        example: false,
      },
      isApproved: {
        type: 'boolean',
        example: false,
      },
      status: {
        type: 'string',
        enum: {
          values: ['active', 'pending', 'deleted'],
          message: 'Allowed values: active, pending, deleted',
        },
        example: 'pending',
      },
      deletedBy: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd5',
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },

      passwordChangedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:08.776Z',
      },
      emailVerificationToken: {
        type: 'string',
        example: 'email-verification-token',
      },
      emailVerificationExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      passwordResetToken: {
        type: 'string',
        example: 'password-reset-token',
      },
      passwordResetExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },
  Patient: {
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
    /*
    const testPatient = {
  fullName: "Sadia Rahman",
  email: "sadia.rahman@example.com",
  phone: "+8801712345678",
  gender: "female",
  profilePhoto: "https://example.com/sadia-profile.jpg",
  password: "securePass789",
  passwordConfirm: "securePass789",
  bloodGroup: "B+",
  dateOfBirth: new Date("1992-03-10"),
  medicalHistory: ["Thyroid Disorder", "Anemia"],
  allergies: ["Shellfish", "Pollen"],
  currentMedications: ["Levothyroxine", "Iron Supplements"],
  location: {
    type: "Point",
    coordinates: [90.412518, 23.810332],
    city: "Dhaka",
    address: "House 12, Road 5, Dhanmondi, Dhaka 1205"
  },
  status: "pending",
  role: "patient",
  isApproved: false,
  emailVerified: false
};
    
    */

    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      fullName: {
        type: 'string',
        example: 'Sadia Rahman',
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'sadia.rahman@example.com',
      },
      phone: {
        type: 'string',
        example: '+8801712345679',
      },
      gender: {
        type: 'string',
        enum: {
          values: ['male', 'female', 'others', 'prefer not to say'],
          message: 'Allowed values: male, female, others, prefer not to say',
        },
        example: 'female',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        example: '1992-03-10',
      },
      location: {
        type: 'object',
        required: ['city', 'address'],
        properties: {
          city: {
            type: 'string',
            example: 'Dhaka',
          },
          address: {
            type: 'string',
            example: 'House 12, Road 5, Dhanmondi, Dhaka 1205',
          },
        },
      },
      bloodGroup: {
        type: 'string',
        enum: {
          values: ['A+', 'B+', 'O+', 'A-', 'B-', 'O-', 'AB+', 'AB-'],
          message: 'Allowed values: A+, B+, O+, A-, B-, O-, AB+, AB-',
        },
        example: 'B+',
      },
      profilePhoto: {
        type: 'string',
        example: 'https://example.com/sadia-profile.jpg',
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
        example: ['Thyroid Disorder', 'Anemia'],
      },
      currentMedications: {
        type: 'array',
        items: {
          type: 'string',
        },
        example: ['Levothyroxine', 'Iron Supplements'],
      },
      prescriptions: {
        type: 'array',
        items: {
          type: 'string',
          format: 'ObjectId',
        },
        example: ['682787f1fea3f44089558cd7'],
      },
      patientRecords: {
        type: 'string',
        format: 'ObjectId',
        example: ['682787f1fea3f44089558cd7'],
      },
      role: {
        type: 'string',
        enum: ['patient'],
        example: 'patient',
      },
      emailVerified: {
        type: 'boolean',
        example: false,
      },
      isApproved: {
        type: 'boolean',
        example: false,
      },

      status: {
        type: 'string',
        enum: {
          values: ['active', 'pending', 'deleted'],
          message: 'Allowed values: active, pending, deleted',
        },
        example: 'pending',
      },
      deletedBy: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd5',
      },
      deletedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },

      passwordChangedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:08.776Z',
      },
      emailVerificationToken: {
        type: 'string',
        example: 'email-verification-token',
      },
      emailVerificationExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      passwordResetToken: {
        type: 'string',
        example: 'password-reset-token',
      },
      passwordResetExpires: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },

  Medication: {
    type: 'object',
    required: ['name', 'dosage', 'frequency', 'duration'],
    properties: {
      name: {
        type: 'string',
        example: 'Aspirin',
      },
      dosage: {
        type: 'string',
        example: '500mg',
      },
      frequency: {
        type: 'array',
        items: {
          type: 'string',
          format: 'time',
        },
        example: ['08:00', '12:00', '18:00'],
      },
      duration: {
        type: 'number',
        example: 7, // in days
      },
      instruction: {
        type: 'string',
        example: 'Take with water, do not exceed the recommended dosage.',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },
  Prescription: {
    type: 'object',
    required: ['doctor', 'appointment', 'medications'],
    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      doctor: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd6',
      },
      appointment: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd8',
      },
      notes: {
        type: 'string',
        example: 'Take the medication after meals.',
      },
      medications: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Medication',
        },
        example: [
          {
            name: 'Aspirin',
            dosage: '500mg',
            frequency: ['08:00', '12:00', '18:00'],
            duration: 7,
            instruction:
              'Take with water, do not exceed the recommended dosage.',
          },
          {
            name: 'Paracetamol',
            dosage: '500mg',
            frequency: ['08:00', '12:00', '18:00'],
            duration: 5,
            instruction: 'Take after meals.',
          },
        ],
      },
      status: {
        type: 'string',
        enum: {
          values: ['active', 'expired', 'deleted'],
          message: 'Allowed values: active, expired, deleted',
        },
        default: 'active',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },
  Appointment: {
    type: 'object',
    required: [
      'doctor',
      'patient',
      'appointmentDate',
      'appointmentSchedule',
      'reason',
    ],
    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      doctor: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd6',
      },
      patient: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      appointmentDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-06-16', // YYYY-MM-DD -> ISO 8601 Date Format
      },
      appointmentSchedule: {
        type: 'object',
        required: ['day', 'hours'],
        properties: {
          day: {
            type: 'string',
            enum: {
              valus: [
                'saturday',
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
              ],
              message: 'Day must be a valid weekday',
            },
            example: 'monday',
          },
          hours: {
            type: 'object',
            required: ['from', 'to'],
            properties: {
              from: {
                type: 'string',
                format: 'time',
                example: '09:00',
              },
              to: {
                type: 'string',
                format: 'time',
                example: '09:59',
              },
            },
          },
        },
      },

      reason: {
        type: 'string',
        example: 'Regular blood pressure check-up and follow-up consultation',
      },
      notes: {
        type: 'string',
        example: 'Patient has been advised to bring previous test reports.',
      },
      consultationType: {
        type: 'string',
        enum: ['in-person', 'online'],
        default: 'in-person',
      },

      paymentMethod: {
        type: 'string',
        enum: ['card', 'cash', 'unknown'],
        default: 'card',
      },
      paymentIntent: {
        type: 'string',
        example: 'pi_1HV8XK2eZvKYlo2C5pFAKE123',
      },
      paymentStatus: {
        type: 'string',
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
      },
      isPrescribed: {
        type: 'boolean',
        default: false,
      },
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },

  /*
  {
  "doctor": "64fc8e27b12d5a9cfdcdef07",
  "patient": "64fc8e27b12d5a9cfdcdef08",
  "appointment": "64fc8e27b12d5a9cfdcdef09",
  "review": "Dr. Rafiq was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.",
  "rating": 5,
  "reply": "Thank you for your kind feedback. We're glad to hear about your experience!",
  "isEdited": false,
  "status": "visible",
  "createdAt": "2025-06-13T14:30:00.000Z",
  "updatedAt": "2025-06-13T14:30:00.000Z"
}

  */
  Review: {
    type: 'object',
    required: ['doctor', 'patient', 'appointment', 'review', 'rating'],
    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      doctor: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd6',
      },
      patient: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      appointment: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd8',
      },
      review: {
        type: 'string',
        example:
          'Dr. Rafiq was very attentive and explained everything clearly. I felt genuinely cared for during my consultation.',
      },
      rating: {
        type: 'number',
        example: 5,
      },
      reply: {
        type: 'string',
        example:
          "Thank you for your kind feedback. We're glad to hear about your experience!",
      },
      isEdited: {
        type: 'boolean',
        default: false,
      },
      status: {
        type: 'string',
        enum: ['visible', 'flagged', 'deleted'],
        default: 'visible',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },
  PatientRecord: {
    type: 'object',

    properties: {
      _id: {
        type: 'string',
        example: '682787f1fea3f44089558cd7',
      },

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
        example: ['Appendectomy (2010)', 'Gallbladder removal (2016)'],
      },
      familyHistory: {
        type: 'array',
        example: ['Father - Heart disease', 'Mother - Type 2 Diabetes'],
      },
      lifestyle: {
        type: 'object',
        properties: {
          badHabits: {
            type: 'array',
            enum: ['smoking', 'alocohol', 'drugs'],
            example: ['smoking'],
          },
          exercise: {
            type: 'string',
            enum: ['none', 'light', 'moderate', 'intense'],
            example: 'moderate',
          },
        },
      },
      medications: {
        type: 'array',
        example: ['682787f1fea3f44089558cd7', '682787f1fea3f44089558cd8'],
      },
      reports: {
        type: 'array',
        items: {
          type: 'object',
          required: ['title', 'description', 'fileUrl', 'issuedBy', 'issuedOn'],
          properties: {
            title: {
              type: 'string',
              example: 'Blood Test Report',
            },
            description: {
              type: 'string',
              example:
                'This report shows the results of a blood test conducted on January 15, 2025.',
            },
            fileUrl: {
              type: 'string',
              example: 'https://example.com/reports/bloodtest_jan2025.pdf',
            },
            issuedBy: {
              type: 'string',
              example: 'Dr. Nafisa Rahman',
            },
            issuedOn: {
              type: 'string',
              format: 'date-time',
              example: '2025-01-15T00:00:00.000Z',
            },
          },
        },
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-16T18:46:09.776Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2025-05-31T02:45:43.207Z',
      },
    },
  },
  Calendar: {
    type: 'object',
    required: ['calendarUID'],
    properties: {
      _id: {
        type: 'string',
        format: 'ObjectId',
        example: '682787f1fea3f44089558cd7',
      },
      calendarUID: {
        type: 'string',
        example:
          '5496bcec2da54d7f43df0530537d8552f36edab7e95f7be26a33828866970d76@group.calendar.google.com',
      },
      accessToken: {
        type: 'string',
        example: 'access_token',
      },
      refreshToken: {
        type: 'string',
        example: 'refresh_token',
      },
      accessTokenExpiry: {
        type: 'string',
        format: 'date-time',
        example: '2025-07-12T14:20:00.000Z',
      },
    },
  },
};
