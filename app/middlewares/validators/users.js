const { users: errorMessages } = require('../../constants/errorMessages');

const emailDefaultValidation = {
  isEmail: {
    bail: true,
    errorMessage: errorMessages.ShouldBeAnEmailMessage
  },
  matches: {
    options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
    errorMessage: errorMessages.OnlyWoloxEmail
  }
};

const passwordDefaultValidation = {
  isLength: {
    errorMessage: errorMessages.PasswordMinLengthMessage,
    options: { min: 8 }
  }
};

const integerDefaultValidation = {
  isInt: {
    errorMessage: errorMessages.ShouldBeANumberGreaterThanZero,
    options: [
      {
        min: 1
      }
    ]
  },
  toInt: true
};

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
  page: {
    in: ['query'],
    notEmpty: true,
    optional: false,
    ...integerDefaultValidation,
    errorMessage: errorMessages.NotValidPageParamMessage
  },
  size: {
    in: ['query'],
    notEmpty: true,
    optional: false,
    ...integerDefaultValidation,
    errorMessage: errorMessages.NotValidSizeParamMessage
  }
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
