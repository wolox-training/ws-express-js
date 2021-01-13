module.exports = {
  userName: {
    type: 'string',
    description: 'User full name',
    example: 'William'
  },
  userLastName: {
    type: 'string',
    description: 'User last name',
    example: 'Salazar'
  },
  userEmail: {
    type: 'string',
    description: 'User email',
    example: 'william.salazar@wolox.co'
  },
  userPassword: {
    type: 'string',
    description: 'User password',
    example: 'ThisIsAVerySecurePassword!'
  },
  User: {
    type: 'object',
    properties: {
      name: {
        $ref: '#/components/schemas/userName'
      },
      last_name: {
        $ref: '#/components/schemas/userLastName'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/userPassword'
      }
    }
  },
  Users: {
    type: 'object',
    properties: {
      users: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/User'
        }
      }
    }
  }
};
