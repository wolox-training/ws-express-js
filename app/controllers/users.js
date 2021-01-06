const { validationResult } = require('express-validator');
const errors = require('../errors');
const logger = require('../../app/logger/index');
const UsersServices = require('../services/users.js');

const UsersController = module.exports;

UsersController.createUser = async (req, res) => {
  const { body } = req;
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const createdUser = await UsersServices.createUser(body);

  const { name } = createdUser;

  logger.info('User created successfully');

  return res.status(201).send({ name });
};
