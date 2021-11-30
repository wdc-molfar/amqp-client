/* eslint-disable class-methods-use-this */
/**
 * @module ConsumerValidate
 */
const Validate = require('./base');
const schemas = require('../schemas');

const { validate } = schemas.consumer;

/**
 * ConsumerValidate
 * @extends Validate
 */
class ConsumerValidate extends Validate {
  /**
   * Викликає повідомлення про помилку, що виникає у зв'язку
   * з відсутніми налаштуваннями отримувача
   * @param options
   */
  static validateOptions(options) {
    if (!validate(options)) {
      throw new Error(
        validate.errors
          .map(
            (e) =>
              `Cannot create Consumer. On "${e.instancePath}": ${e.message}`,
          )
          .join('\n'),
      );
    }
  }
}

module.exports = ConsumerValidate;
