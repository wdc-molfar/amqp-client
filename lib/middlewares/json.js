/* eslint-disable no-useless-catch */
/* eslint-disable no-param-reassign */
/**
 * middleware, який конвертує Buffer в string
 * @param err помилка, що виникла на одній з минулих ітерації.
 * @param msg об'єкт з даними.
 * @param next функція-колбек наступної проміжної обробки.
 */
const stringify = (err, msg, next) => {
  msg.content = JSON.stringify(msg.content);
  next();
};

/**
 * middleware, який конвертує string в object
 * @param err помилка, що виникла на одній з минулих ітерації.
 * @param msg об'єкт з даними.
 * @param next функція-колбек наступної проміжної обробки.
 */
const parse = (err, msg, next) => {
  try {
    msg.content = JSON.parse(msg.content);
  } catch (e) {
    throw e;
  }
  next();
};

module.exports = {
  stringify,
  parse,
};
