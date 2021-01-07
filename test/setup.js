const models = require('../app/models');

const tables = Object.values(models.sequelize.models);

const Setup = module.exports;

Setup.truncateTable = model =>
  model.destroy({ truncate: true, cascade: true, force: true, restartIdentity: true });

Setup.truncateDatabase = () => Promise.all(tables.map(Setup.truncateTable));

Setup.createUsers = usersData => models.user.bulkCreate(usersData);
