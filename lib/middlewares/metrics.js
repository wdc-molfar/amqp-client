/**
 * функція-фабрика, яка отримує об'єкт з метрикою та її ініціалізацією
 * та повертає функцію типу middleware
 * @param options конфіг з метрикою та ініціалізаційним колбеком.
 * @returns {metricMiddleware}  middleware, де в залежності
 * від виконання обробника виконується подальша логіка
 */
const Metric =
  (options) =>
  /**
   * @func metricMiddleware ініціалізує та виконує операцію з метрикою,
   * передаючи параметри * в метод .callback()
   * @param err помилка, що виникла на одній з минулих ітерації.
   * @param msg об'єкт з даними.
   * @param next функція-колбек наступної проміжної обробки.
   */
  (err, msg, next) => {
    options.callback(err, msg, options.metric);
    next();
  };

module.exports = Metric;
