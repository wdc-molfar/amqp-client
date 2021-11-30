/* eslint-disable no-useless-catch */
/**
 * функція-фабрика, яка отримує обробник даних, повертає функцію типу
 * middleware
 * @param predicate функція-обробник фільтрації.
 * @returns {filterMiddleware}  middleware, де в залежності
 * від виконання обробника виконується подальша логіка
 */
const Filter =
  (predicate) =>
  /**
   * @func filterMiddleware
   * @param err помилка, що виникла на одній з минулих ітерації.
   * @param msg об'єкт з даними.
   * @param next функція-колбек наступної проміжної обробки.
   */
  (err, msg, next) => {
    try {
      if (predicate(msg)) next();
    } catch (e) {
      throw e;
    }
  };

module.exports = {
  Filter,
};
