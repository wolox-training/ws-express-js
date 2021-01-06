const errors = module.exports;

const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.BAD_REQUEST_ERROR = 'bad_request_error';
exports.badRequestError = message => internalError(message, exports.BAD_REQUEST_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, errors.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.statusCodes = {
  [exports.BAD_REQUEST_ERROR]: 400,
  [exports.DATABASE_ERROR]: 503,
  [exports.DEFAULT_ERROR]: 500
};

exports.getErrorMessage = {
  400: exports.badRequestError,
  503: exports.databaseError,
  500: exports.defaultError
};
