const { users: errorMessages } = require('../../app/constants/errorMessages');

module.exports = {
  newUserData: {
    name: 'William',
    lastName: 'Salazar',
    email: 'william.salazar@wolox.co',
    password: 'thisIsAVerySecurePassword'
  },
  NotValidEmail: 'william@gmail.com',
  ...errorMessages
};
