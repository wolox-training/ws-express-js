const {
  emailDefaultValidation,
  passwordDefaultValidation,
  defaultSchemaPagination
} = require('./defaultValidations');
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
    ...emailDefaultValidation,
    notEmpty: true,
    optional: false,
    errorMessage: errorMessages.ShouldBeAnEmailMessage
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    ...passwordDefaultValidation,
    errorMessage: errorMessages.NotValidEmailMessage
  }
};

UsersSchemas.get = {
  ...defaultSchemaPagination
};

UsersSchemas.postSessions = {
  email: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    ...emailDefaultValidation,
    errorMessage: errorMessages.NotValidEmailMessage
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    ...passwordDefaultValidation,
    errorMessage: errorMessages.NotValidPasswordMessage
  }
};
