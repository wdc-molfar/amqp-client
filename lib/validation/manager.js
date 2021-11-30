/* eslint-disable class-methods-use-this */
/**
 * @module ManagerValidate
 */
const Validate = require('./base');
const schemas = require('../schemas');

const { validate } = schemas.connection;

/**
 * ManagerValidate
 * @extends Validate
 */
class ManagerValidate extends Validate {
  /**
   * Викликає повідомлення про помилку,
   * що виникає у зв'язку з відсутньою url властивості
   * @param options
   */
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

module.exports = ManagerValidate;
