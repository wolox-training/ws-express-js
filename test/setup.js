const models = require('../app/models');

const tables = Object.values(models.sequelize.models);
const MailUtils = require('../app/helpers/mailUtils');
const ScheduledTasks = require('../app/helpers/scheduledTasks');
const DataTest = require('./data/users');

const Setup = module.exports;

jest.spyOn(ScheduledTasks, 'start').mockImplementation(() => DataTest.MockedResponseScheduleTasks);
jest.spyOn(MailUtils, 'sendMail').mockImplementation(() => DataTest.MockedResponseFromSendMail);
jest.mock('../app/middlewares/auth0.js', () => jest.fn((req, res, next) => next()));
jest.mock('../app/middlewares/loadMetadata.js', () =>
  jest.fn((req, res, next) => {
    req.user = {
      name: 'admin',
      lastName: 'lastName',
      email: 'admin@wolox.co',
      isAdmin: true,
      password: '12345678'
    };
    next();
  })
);

Setup.truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

Setup.truncateDatabase = () => Promise.all(tables.map(Setup.truncateTable));

Setup.createUsers = usersData =>
  models.user.bulkCreate(usersData, {
    individualHooks: true
  });

Setup.createWeets = weetsData => models.weet.bulkCreate(weetsData);

Setup.createBlacklistedTokens = tokensData => models.blacklist.bulkCreate(tokensData);
