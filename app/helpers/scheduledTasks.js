const { Sequelize, Op } = require('sequelize');
const { CronJob } = require('cron');

const { weet: WeetModel, user: UserModel } = require('../models/index');
const logger = require('../logger');
const { sendCongratulationMail } = require('./mailUtils');

const millisecondInADay = 86400000;

const findBestWitters = async () => {
  const now = new Date();
  const dayAgo = new Date(now - millisecondInADay);

  logger.info('Init findBestWitters');

  const countByUserId = Sequelize.fn('COUNT', 'userId');
  const group = 'user.id';

  const options = {
    where: {
      createdAt: {
        [Op.gt]: dayAgo,
        [Op.lt]: now
      }
    },
    group,
    attributes: [group, [countByUserId, 'totalWeets']],
    include: { model: UserModel, attributes: ['name', 'email'] },
    order: [[countByUserId, 'DESC']],
    limit: 3
  };

  try {
    const mostActiveUsers = await WeetModel.findAll(options).map(({ user }) => user);

    mostActiveUsers.forEach(user => sendCongratulationMail(user));

    logger.info('Congratulatory emails were sent');

    return mostActiveUsers;
  } catch (error) {
    logger.error(error);
    return error;
  }
};

const ScheduledTasks = module.exports;

ScheduledTasks.start = () => {
  const job = new CronJob('0 0 9 * * *', findBestWitters);
  job.start();
};
