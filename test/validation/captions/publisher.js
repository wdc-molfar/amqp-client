/* eslint-disable max-len */
const PublisherCaptions = {
  publisherDescription: {
    en: 'Consumer validate',
    ua: 'Consumer валідація',
  },
  missingAmqpExchangeMessage: {
    en: 'should return correct error message with missing amqp, exchange, message properties',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутні amqp, exchange, message властивості',
  },
  incorrectAmqp: {
    en: 'should return correct error message with incorrect amqp property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній amqp(object)',
  },
  incorrectAmqpMissingUrl: {
    en: 'should return correct error message with incorrect amqp property(missing url)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний amqp(відсутній url)',
  },
  incorrectAmqpNoValidUrl: {
    en: 'should return correct error message with incorrect amqp property(url need string)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний amqp(url має бути string)',
  },
  incorrectExchange: {
    en: 'should return correct error message with incorrect exchange property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній exchange(object)',
  },
  incorrectExchangeMissingNestProperties: {
    en: 'should return correct error message with incorrect exchange property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange(відсутні вкладені поля)',
  },
  incorrectExchangeNoValidName: {
    en: 'should return correct error message with incorrect exchange/name property(string)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange/name(string)',
  },
  incorrectExchangeNoValidMode: {
    en: 'should return correct error message with incorrect exchange/mode property(string)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange/mode(string)',
  },
  incorrectExchangeOptions: {
    en: 'should return correct error message with incorrect exchange/options property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній exchange/options(object)',
  },
  incorrectExchangeOptionsMissingNestProperties: {
    en: 'should return correct error message with incorrect exchange/options property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange/options(відсутні вкладені поля)',
  },
  incorrectExchangeOptionsNoValidDurable: {
    en: 'should return correct error message with incorrect exchange/options/durable property(string)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange/options/durable(string)',
  },
  incorrectExchangeOptionsNoValidAutoDelete: {
    en: 'should return correct error message with incorrect exchange/options/autoDelete property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний exchange/options/autoDelete(boolean)',
  },
  incorrectMessage: {
    en: 'should return correct error message with incorrect message property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній message(object)',
  },
  incorrectMessageMissingNestProperties: {
    en: 'should return correct error message with incorrect message property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний message(відсутні вкладені поля)',
  },
  incorrectMessageOptions: {
    en: 'should return correct error message with incorrect message/options property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній message/options(object)',
  },
  incorrectMessageOptionsMissingNestProperties: {
    en: 'should return correct error message with incorrect message/options property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний message/options(відсутні вкладені поля)',
  },
  incorrectMessageOptionsNoValidPersistent: {
    en: 'should return correct error message with incorrect message/options/persistent property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний message/options/noAck(boolean)',
  },
};

module.exports = PublisherCaptions;
