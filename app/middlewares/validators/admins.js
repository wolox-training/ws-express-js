const { emailDefaultValidation, passwordDefaultValidation } = require('./defaultValidations');
const { users: errorMessages } = require('../../constants/errorMessages');

const UsersSchemas = module.exports;

UsersSchemas.postUsers = {
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
