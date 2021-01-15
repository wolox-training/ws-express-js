const { defaultSchemaPagination } = require('./defaultValidations');

const WeetsSchemas = module.exports;

WeetsSchemas.get = {
  ...defaultSchemaPagination
};

WeetsSchemas.postRateWeet = {
  rate: {
    in: ['body'],
    optional: false,
    isInt: {
      errorMessage: 'Should be a number'
    },
    toInt: true,
    errorMessage: 'Should not be null or empty'
  }
};
