const { validationResult } = require('express-validator');
const errors = require('../errors');
const logger = require('../../app/logger/index');
const AdminsServices = require('../services/admins');

const AdminsController = module.exports;

AdminsController.createAdmin = async (req, res) => {
  const isValidRequest = validationResult(req).array();

  if (isValidRequest.length) {
    throw errors.badRequestError(isValidRequest[0].msg);
  }

  const {
    user: { isAdmin = false },
    body
  } = req;

  if (!isAdmin) throw errors.forbiddenError('Only for admins');

  const { admin, isCreated } = await AdminsServices.createAdmin(body);

  if (isCreated) {
    logger.info('New admin created');
    return res.status(201).send(admin);
  }

  logger.info('User becomes admin');
  return res.status(200).send(admin);
};
