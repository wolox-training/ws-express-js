const emailDefaultValidation = {
  isEmail: {
    bail: true,
    errorMessage: 'Should be an email'
  },
  matches: {
    options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
    errorMessage: 'You may only use email addresses from wolox'
  }
};

const passwordDefaultValidation = {
  isLength: {
    errorMessage: 'Password length should be minimum 8',
    options: { min: 8 }
  }
};

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
