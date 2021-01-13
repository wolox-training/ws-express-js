const { users: errorMessages } = require('../../constants/errorMessages');

const DefaultValidations = module.exports;

DefaultValidations.emailDefaultValidation = {
  isEmail: {
    bail: true,
    errorMessage: errorMessages.ShouldBeAnEmailMessage
  },
  matches: {
    options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
    errorMessage: errorMessages.OnlyWoloxEmail
  }
};

DefaultValidations.passwordDefaultValidation = {
  isLength: {
    errorMessage: errorMessages.PasswordMinLengthMessage,
    options: { min: 8 }
  }
};

DefaultValidations.integerDefaultValidation = {
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

DefaultValidations.defaultSchemaPagination = {
  page: {
    in: ['query'],
    notEmpty: true,
    optional: false,
    ...DefaultValidations.integerDefaultValidation,
    errorMessage: errorMessages.NotValidPageParamMessage
  },
  size: {
    in: ['query'],
    notEmpty: true,
    optional: false,
    ...DefaultValidations.integerDefaultValidation,
    errorMessage: errorMessages.NotValidSizeParamMessage
  }
};
