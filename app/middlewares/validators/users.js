const { users: errorMessages } = require('../../constants/errorMessages');

const UsersSchemas = module.exports;

UsersSchemas.post = {
  name: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    errorMessage: errorMessages.NotValidNameMessage
  },
  last_name: {
    in: ['body'],
    notEmpty: false
  },
  email: {
    in: ['body'],
    isEmail: {
      bail: true,
      errorMessage: errorMessages.ShouldBeAnEmailMessage
    },
    matches: {
      options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
      errorMessage: errorMessages.OnlyWoloxEmail
    },
    notEmpty: true,
    optional: false,
    errorMessage: errorMessages.NotValidEmailMessage
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    isLength: {
      errorMessage: errorMessages.PasswordMinLengthMessage,
      options: { min: 8 }
    },
    errorMessage: errorMessages.NotValidPasswordMessage
  }
};
