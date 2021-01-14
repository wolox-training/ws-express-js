const { defaultSchemaPagination } = require('./defaultValidations');

const WeetsSchemas = module.exports;

WeetsSchemas.get = {
  ...defaultSchemaPagination
};
