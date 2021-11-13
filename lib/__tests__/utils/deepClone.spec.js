import deepClone from '../../utils/deepClone';

describe('deepClone - test function', () => {
  it('should return correct result of concating 2 objects', () => {
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
});
