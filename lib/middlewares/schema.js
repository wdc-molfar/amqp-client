const Ajv = require('ajv').default;

const ajv = new Ajv({ allErrors: true });
require('ajv-formats')(ajv);
require('ajv-errors')(ajv /* , {singleError: true} */);

/**
 * функція-фабрика, яка валідаційну schema
 * проводить ініціалізацію validationFunction
 * та повертає функцію типу middleware
 * @param options конфіг для валідації.
 * @returns {validatorMiddleware}  middleware, де в залежності
 * від виконання обробника виконується подальша логіка
 */
const validator = (schema) => {
  const validate = ajv.compile(schema);

  /**
   * @func validatorMiddleware перевіряє дані за допомогою валідаційної функції
   * та повертає або помилку або продовжує ланцюжок екшинів в залежності від
   * наявності чи відсутності помилок
   * @param err помилка, що виникла на одній з минулих ітерації.
   * @param msg об'єкт з даними.
   * @param next функція-колбек наступної проміжної обробки.
   */
  return (err, msg, next) => {
    validate(msg.content);
    if (validate.errors) {
      throw new Error(`Bad message format. 
${JSON.stringify(msg.content, null, '')}
${validate.errors
  .map((e) => `On the path "${e.instancePath || '#'}": ${e.message}`)
  .join('')}`);
    }
    next();
  };
};

module.exports = {
  validator,
};
