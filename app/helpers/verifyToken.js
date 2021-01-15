/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');

const { unauthorizedError, notFoundError } = require('../errors');
const { user: UserModel, blacklist: BlacklistModel } = require('../models/index');
const { users: errorMessages } = require('../constants/errorMessages');

const {
  common: {
    session: { secret: SECRET_KEY }
  }
} = require('../../config/index');

const BEARER = 'Bearer ';

module.exports = async token => {
  const filteredToken = token.replace(BEARER, '');

  const decoded = jwt.verify(filteredToken, SECRET_KEY);

  const { iat: _, exp, ...payload } = decoded;

  const user = await UserModel.findOne({ where: payload });

  if (!user) throw notFoundError(errorMessages.UserNotFoundMessage);

  const isDisable = await BlacklistModel.findOne({ where: { token: filteredToken, isDisable: true } });

  if (isDisable) throw unauthorizedError(errorMessages.DisabledTokenMessage);

  return user;
};
