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

UsersController.signIn = async (req, res) => {
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const {
    body: { email, password }
  } = req;

  const signedUser = await UsersServices.signIn(email, password);

  logger.info('User signed successfully');

  return res.status(200).send(signedUser);
};

UsersController.getUsersList = async (req, res) => {
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const {
    query: { page, size }
  } = req;

  const paginatedUsers = await UsersServices.getUsersList(page, size);

  logger.info('Users were listed successfully');

  return res.status(200).send(paginatedUsers);
};
