const deepClone = require('../../lib/utils/deepClone');
const DeepCLoneCaptions = require('./captions');

describe(DeepCLoneCaptions.deepCloneDescription.ua, () => {
  it(DeepCLoneCaptions.correctTwoObjects.ua, () => {
    const defaultOptions = {
      exchange: {
        name: 'amqp_test_exchange',
        mode: 'fanout',
        options: { durable: true, autoDelete: false },
      },
      message: { options: { persistent: true } },
    };
    const options = {
      amqp: {
        url: 'amqp:localhost',
      },
      exchange: { name: 'amqp_test_exchange' },
    };
    expect(deepClone(deepClone({}, defaultOptions), options || {})).toEqual({
      exchange: {
        name: 'amqp_test_exchange',
        mode: 'fanout',
        options: { durable: true, autoDelete: false },
      },
      message: { options: { persistent: true } },
      amqp: {
        url: 'amqp:localhost',
      },
    });
  });

  it(DeepCLoneCaptions.correctAnyType.ua, () => {
    const source = {
      dateOfBirth: new Date(Date.now()),
      parents: ['mome', 'dad'],
    };
    const target = {};
    expect(deepClone(target, source)).toEqual(source);
  });
});
