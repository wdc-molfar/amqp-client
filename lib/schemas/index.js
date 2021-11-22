const Ajv = require('ajv').default;

const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv);
require('ajv-errors')(ajv /* , {singleError: true} */);

const schemas = require('@molfar/msapi-schemas');

module.exports = {
  consumer: {
    schema: schemas.consumeStrict.json,
    validate: ajv.compile(schemas.consumeStrict.json),
  },
  publisher: {
    schema: schemas.produceStrict.json,
    validate: ajv.compile(schemas.produceStrict.json),
  },
  connection: {
    schema: schemas.connectionStrict.json,
    validate: ajv.compile(schemas.connectionStrict.json),
  },
};
