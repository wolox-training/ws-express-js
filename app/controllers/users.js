const errors = require('../errors');
const UsersServices = require('../services/users.js');
const logger = require('../../app/logger/index');

const WOLOX_EMAIL_DOMAIN = '@wolox';
const UsersController = module.exports;

UsersController.createUser = async (req, res) => {
  const { body, body: { email } = {} } = req;

  if (!email.includes(WOLOX_EMAIL_DOMAIN)) throw errors.badRequestError('Not valid email');

  const createdUser = await UsersServices.createUser(body);

  const { name } = createdUser;

  logger.info('User created successfully');

  res.status(201).send({ name });
};
