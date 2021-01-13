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
    isEmail: {
      bail: true,
      errorMessage: 'Should be an email'
    },
    matches: {
      options: /(\w|-|\.)+@(wolox)\.(\w|\.){2,15}$/i,
      errorMessage: 'You may only use email addresses from wolox'
    },
    notEmpty: true,
    optional: false,
    errorMessage: 'Email should not be null or empty'
  },
  password: {
    in: ['body'],
    notEmpty: true,
    optional: false,
    isLength: {
      errorMessage: 'Password length should be minimum 8',
      options: { min: 8 }
    },
    errorMessage: 'Password should not be null or empty'
  }
};
