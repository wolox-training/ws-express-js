const { ValidationError, DatabaseError } = require('sequelize');
const errors = require('../errors');
const logger = require('../logger');

const DEFAULT_STATUS_CODE = 500;
const VALIDATION_ERROR_STATUS_CODE = 400;

exports.handle = (error, req, res, next) => {
  if (error.internalCode) res.status(errors.statusCodes[error.internalCode] || DEFAULT_STATUS_CODE);
  else if (error instanceof ValidationError) {
    res.status(VALIDATION_ERROR_STATUS_CODE);
    error.internalCode = errors.BAD_REQUEST_ERROR;
  } else if (error instanceof DatabaseError) {
    res.status(errors.statusCodes[errors.DATABASE_ERROR]);
    error.internalCode = errors.DATABASE_ERROR;
  } else {
    // Unrecognized error, notifying it to rollbar.
    res.status(DEFAULT_STATUS_CODE);
    error.internalCode = errors.DEFAULT_ERROR;
    next(error);
  }

  logger.error(error);
  return res.send({ message: error.message, internal_code: error.internalCode });
};
