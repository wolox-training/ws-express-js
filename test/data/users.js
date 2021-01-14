const { users: errorMessages } = require('../../app/constants/errorMessages');

module.exports = {
  newUserData: {
    name: 'William',
    lastName: 'Salazar',
    email: 'william.salazar@wolox.co',
    password: 'thisIsAVerySecurePassword'
  },
  NotValidEmail: 'william@gmail.com',
  ...errorMessages,
  NotExistingEmail: 'notexist@wolox.co',
  IncorrectPassword: 'thisIsAnIncorrectPassword',
  NotANumber: 'definitelyNotANumber',
  TooBigNumber: 99999999999999999,
  MockedResponseFromSendMail: 'mail response'
};
