const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.statusCodes = {
  [exports.DATABASE_ERROR]: 503,
  [exports.DEFAULT_ERROR]: 500
};

exports.getErrorMessage = {
  503: exports.databaseError,
  500: exports.defaultError
};
