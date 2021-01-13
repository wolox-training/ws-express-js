/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */
const jwt = require('jsonwebtoken');

const { unauthorizedError, notFoundError } = require('../errors');
const { user: UserModel } = require('../models/index');
const {
  common: {
    session: { header_name: HEADER_NAME, secret: SECRET_KEY }
  }
} = require('../../config/index');
const { users: errorMessages } = require('../constants/errorMessages');

const BEARER = 'Bearer ';

const verifyToken = async token => {
  const filteredToken = token.replace(BEARER, '');

  const decoded = jwt.verify(filteredToken, SECRET_KEY);

  const { iat: _, exp, ...payload } = decoded;

  const user = await UserModel.findOne({ where: payload });

  if (!user) throw notFoundError(errorMessages.UserNotFoundMessage);

  return { ...user.getPublicData(), token: filteredToken };
};

module.exports = async (req, res, next) => {
  try {
    const token = req.header(HEADER_NAME);

    if (!token) throw unauthorizedError(errorMessages.UserUnauthorizedMessage);

    const user = await verifyToken(token);

    req.token = user.token;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
