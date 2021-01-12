const DefaultValidations = module.exports;

DefaultValidations.emailDefaultValidation = {
  isEmail: {
    bail: true,
    errorMessage: 'Should be an email'
  },
  matches: {
    options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
    errorMessage: 'You may only use email addresses from wolox'
  }
};

DefaultValidations.passwordDefaultValidation = {
  isLength: {
    errorMessage: 'Password length should be minimum 8',
    options: { min: 8 }
  }
};

DefaultValidations.integerDefaultValidation = {
  isInt: {
    errorMessage: 'Should be a number greater than 0',
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
    errorMessage: 'Page should not be null or empty'
  },
  size: {
    in: ['query'],
    notEmpty: true,
    optional: false,
    ...DefaultValidations.integerDefaultValidation,
    errorMessage: 'size should not be null or empty'
  }
};
