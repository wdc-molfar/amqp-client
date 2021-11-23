/* eslint-disable max-len */
const ConsumerCaptions = {
  consumerDescription: {
    en: 'Consumer validate',
    ua: 'Consumer валідація',
  },
  missingAmqpQueueMessage: {
    en: 'should return correct error message with missing amqp, queue, message properties',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутні amqp, queue, message властивості',
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
  incorrectQueue: {
    en: 'should return correct error message with incorrect queue property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній queue(object)',
  },
  incorrectQueueMissingNestProperties: {
    en: 'should return correct error message with incorrect queue property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue(відсутні вкладені поля)',
  },
  incorrectQueueNoValidName: {
    en: 'should return correct error message with incorrect queue/name property(string or null)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/name(string or null)',
  },
  incorrectQueueExchange: {
    en: 'should return correct error message with incorrect queue/exchange property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній queue/exchange(object)',
  },
  incorrectQueueExchangeMissingNestProperties: {
    en: 'should return correct error message with incorrect queue/exchange property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/exchange(відсутні вкладені поля)',
  },
  incorrectQueueExchangeNoValidName: {
    en: 'should return correct error message with incorrect queue/exchange/name property(string)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/exchange/name(string)',
  },
  incorrectQueueExchangeOptions: {
    en: 'should return correct error message with incorrect queue/exchange/options property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній queue/exchange/options(object)',
  },
  incorrectQueueExchangeOptionsMissingNestProperties: {
    en: 'should return correct error message with incorrect queue/exchange/options property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/exchange/options(відсутні вкладені поля)',
  },
  incorrectQueueExchangeOptionsNoValidDurable: {
    en: 'should return correct error message with incorrect queue/exchange/options/durable property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/exchange/options/durable(boolean)',
  },
  incorrectQueueExchangeOptionsNoValidAutoDelete: {
    en: 'should return correct error message with incorrect queue/exchange/options/autoDelete property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/exchange/options/autoDelete(boolean)',
  },
  incorrectQueueOptions: {
    en: 'should return correct error message with incorrect queue/options property(object)',
    ua: 'Повинен повернути правильне повідомлення про помилку через відсутній queue/options(object)',
  },
  incorrectQueueOptionsMissingNestProperties: {
    en: 'should return correct error message with incorrect queue/options property(missing nest properties)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options(відсутні вкладені поля)',
  },
  incorrectQueueOptionsNoValidNoAck: {
    en: 'should return correct error message with incorrect queue/options/noAck property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options/noAck(boolean)',
  },
  incorrectQueueOptionsNoValidExclusive: {
    en: 'should return correct error message with incorrect queue/options/exclusive property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options/exclusive(boolean)',
  },
  incorrectQueueOptionsNoValidDurable: {
    en: 'should return correct error message with incorrect queue/options/durable property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options/durable(boolean)',
  },
  incorrectQueueOptionsNoValidAutoDelete: {
    en: 'should return correct error message with incorrect queue/options/durable property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options/durable(boolean)',
  },
  incorrectQueueOptionsNoValidPrefetch: {
    en: 'should return correct error message with incorrect queue/options/prefetch property(number)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний queue/options/prefetch(number)',
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
  incorrectMessageOptionsNoValidNoAck: {
    en: 'should return correct error message with incorrect message/options/noAck property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний message/options/noAck(boolean)',
  },
  incorrectMessageOptionsNoValidExclusive: {
    en: 'should return correct error message with incorrect message/options/exclusive property(boolean)',
    ua: 'Повинен повернути правильне повідомлення про помилку через невалідний message/options/exclusive(boolean)',
  },
};

module.exports = ConsumerCaptions;
