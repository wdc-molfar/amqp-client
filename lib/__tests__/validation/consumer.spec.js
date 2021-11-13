/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
import ConsumerValidate from '../../validation/consumer';

describe('Consumer validate', () => {
  it('should return correct error message with missing amqp, queue, message properties', () => {
    try {
      ConsumerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'amqp\''),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'queue\''),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'message\''),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(object)', () => {
    try {
      ConsumerValidate.validateOptions({ amqp: null });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(missing url)', () => {
    try {
      ConsumerValidate.validateOptions({ amqp: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp": must have required property \'url\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(need string)', () => {
    try {
      ConsumerValidate.validateOptions({
        amqp: {
          url: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp/url": url should be a valid AMQP-connection string',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue property(object)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue property(missing nest properties)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue": must have required property \'exchange\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue": must have required property \'options\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/name property(string or null)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          name: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/name": must be string',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/name": must be null',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange property(missing properties)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange": must have required property \'name\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange": must have required property \'mode\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange": must have required property \'options\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange/name property(string)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            name: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/name": Exchange name is required. It should be a string',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange/options property(object)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/options": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange/options property(missing nest properties)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: {},
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/options": must have required property \'durable\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/options": must have required property \'autoDelete\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange/options/durable property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: {
              durable: null
            },
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/options/durable": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/exchange/options/autoDelete property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: {
              autoDelete: null
            },
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/exchange/options/autoDelete": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options property(missing nest properties)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options": must have required property \'noAck\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options": must have required property \'exclusive\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options": must have required property \'durable\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options": must have required property \'autoDelete\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options": must have required property \'prefetch\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options/noAck property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            noAck: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options/noAck": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options/exclusive property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            exclusive: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options/exclusive": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options/durable property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            durable: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options/durable": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options/autoDelete property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            autoDelete: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options/autoDelete": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect queue/options/prefetch property(number)', () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            prefetch: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/queue/options/prefetch": must be number',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message property(object)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message property(missing nest properties)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message": must have required property \'options\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options property(object)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options property(object)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options": must have required property \'noAck\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options": must have required property \'exclusive\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options/noAck property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {
            noAck: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options/noAck": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options/exclusive property(boolean)', () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {
            exclusive: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options/exclusive": must be boolean',
        ),
      );
    }
  });

  it('should validate successfully', () => {
    expect(ConsumerValidate.validateOptions({
      queue: {
        name: null,
        exchange: {
          name: 'amqp_test_exchange',
          mode: 'fanout',
          options: {
            durable: true,
            autoDelete: false
          }
        },
        options: {
          noAck: false,
          exclusive: false,
          durable: true,
          autoDelete: false,
          prefetch: 1
        }
      },
      message: { options: { noAck: false, exclusive: false } },
      amqp: {
        url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg?heartbeat=60'
      }
    })).not.toBeDefined();
  });
});
