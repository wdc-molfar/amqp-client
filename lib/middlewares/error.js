/**
 * middleware, але "розбиває" ланцюжок виконання колбеків, якщо є помилка
 * @param err помилка, що виникла на одній з минулих ітерації.
 * @param msg об'єкт з даними.
 * @param next функція-колбек наступної проміжної обробки.
 */
const BreakChain = (err, msg, next) => {
  if (!err) {
    next();
  }
};

/**
 * middleware, але логує помилку, якщо вона є
 * @param err помилка, що виникла на одній з минулих ітерації.
 * @param msg об'єкт з даними.
 * @param next функція-колбек наступної проміжної обробки.
 */
const Log = (err, msg, next) => {
  if (err) {
    console.log(err);
  }
  next();
};

module.exports = {
  BreakChain,
  Log,
};
