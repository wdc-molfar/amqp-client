/* eslint-disable class-methods-use-this */
import Validate from './base';
import schemas from '../schemas';

const { validate } = schemas.consumer;

class ConsumerValidate extends Validate {
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

export default ConsumerValidate;
