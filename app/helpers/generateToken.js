const jwt = require('jsonwebtoken');

const config = require('../../config/index');

const {
  common: {
    session: { secret: SECRET_KEY, expiration: EXPIRATION }
  }
} = config;

const getToken = payload => jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRATION });

module.exports = getToken;
