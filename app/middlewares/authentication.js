/* eslint-disable require-atomic-updates */

const { unauthorizedError } = require('../errors');
const { users: errorMessages } = require('../constants/errorMessages');
const verifyToken = require('../helpers/verifyToken');

const {
  common: {
    session: { header_name: HEADER_NAME }
  }
} = require('../../config/index');

module.exports = async (req, res, next) => {
  try {
    const token = req.header(HEADER_NAME);

    if (!token) throw unauthorizedError(errorMessages.UserUnauthorizedMessage);

    const user = await verifyToken(token);

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
