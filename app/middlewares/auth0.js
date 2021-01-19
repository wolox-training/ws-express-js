const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

const {
  common: {
    auth0: { audience, jwksUri, issuer }
  }
} = require('../../config');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri
  }),
  audience,
  issuer,
  algorithms: ['RS256']
});

module.exports = jwtCheck;
