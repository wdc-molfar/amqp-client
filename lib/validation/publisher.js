/* eslint-disable class-methods-use-this */
/**
 * @module PublisherValidate
 */
const Validate = require('./base');
const schemas = require('../schemas');

const { validate } = schemas.publisher;

/**
 * PublisherValidate
 * @extends Validate
 */
class PublisherValidate extends Validate {
  /**
   * Викликає повідомлення про помилку, що виникає у зв'язку
   * з відсутніми налаштуваннями публікувальника
   * @param options
   */
  static validateOptions(options) {
    if (!validate(options)) {
      throw new Error(
        validate.errors
          .map(
            (e) =>
              `Cannot create Publisher. On "${e.instancePath}": ${e.message}`,
          )
          .join('\n'),
      );
    }
  }
}

module.exports = PublisherValidate;
