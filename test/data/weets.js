const { weets: errorMessages } = require('../../app/constants/errorMessages');

module.exports = {
  getMockedResponseFromAxios: { joke: 'this is a very nice joke' },
  notExistingWeetId: '500',
  ...errorMessages
};
