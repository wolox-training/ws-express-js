const errors = module.exports;

const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.FORBIDDEN_ERROR = 'forbidden_error';
errors.forbiddenError = message => internalError(message, exports.FORBIDDEN_ERROR);

exports.NOT_FOUND_ERROR = 'not_found_error';
exports.notFoundError = message => internalError(message, exports.NOT_FOUND_ERROR);

exports.UNAUTHORIZED_ERROR = 'unauthorized_error';
exports.unauthorizedError = message => internalError(message, exports.UNAUTHORIZED_ERROR);

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.badRequestError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, errors.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.statusCodes = {
  [exports.FORBIDDEN_ERROR]: 403,
  [exports.BAD_REQUEST_ERROR]: 400,
  [exports.NOT_FOUND_ERROR]: 404,
  [exports.UNAUTHORIZED_ERROR]: 401,
  [exports.DATABASE_ERROR]: 503,
  [exports.DEFAULT_ERROR]: 500
};

exports.getErrorMessage = {
  403: exports.forbiddenError,
  400: exports.badRequestError,
  404: exports.notFoundError,
  401: exports.unauthorizedError,
  503: exports.databaseError,
  500: exports.defaultError
};
