const errors = require('../errors');
const UsersServices = require('../services/users.js');
const logger = require('../../app/logger/index');

const WOLOX_EMAIL_DOMAIN = '@wolox';
const UsersController = module.exports;

UsersController.createUser = async (req, res) => {
  const { body, body: { name, email, password, lastName } = {} } = req;

  if (!name) throw errors.badRequestError('Not valid name');
  if (!lastName) throw errors.badRequestError('Not valid last name');
  if (!password || password.length < 8) throw errors.badRequestError('Not valid password');
  if (!email || !email.includes(WOLOX_EMAIL_DOMAIN)) throw errors.badRequestError('Not valid email');

  const createdUser = await UsersServices.createUser(body);

  const { name: userName } = createdUser;

  logger.info('User created successfully');

  res.status(201).send({ name: userName });
};
