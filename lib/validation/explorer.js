/* eslint-disable class-methods-use-this */
const Validate = require('./base');
const schemas = require('../schemas');

const { validate } = schemas.connection;

class ExplorerValidate extends Validate {
  static validateOptions(options) {
    if (!validate(options)) {
      throw new Error(
        validate.errors
          .map(
            (e) =>
              `Cannot create connection. On ".${e.instancePath}": ${e.message}`,
          )
          .join('\n'),
      );
    }
  }
}

module.exports = ExplorerValidate;
