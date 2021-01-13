const {
  emailDefaultValidation,
  passwordDefaultValidation,
  defaultSchemaPagination
} = require('./defaultValidations');

const UsersSchemas = module.exports;

UsersSchemas.post = {
  name: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    errorMessage: 'Name cannot be null or empty'
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
    errorMessage: 'Email should not be null or empty'
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    ...passwordDefaultValidation,
    errorMessage: 'Password should not be null or empty'
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
    errorMessage: 'Email should not be null or empty'
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    ...passwordDefaultValidation,
    errorMessage: 'Password should not be null or empty'
  }
};
