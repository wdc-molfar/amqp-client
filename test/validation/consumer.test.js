/* eslint-disable max-len */
const ConsumerValidate = require('../../lib/validation/consumer');
const ConsumerCaptions = require('./captions/consumer');

describe(ConsumerCaptions.consumerDescription.ua, () => {
  it(ConsumerCaptions.missingAmqpQueueMessage.ua, () => {
    try {
      ConsumerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectAmqp.ua, () => {
    try {
      ConsumerValidate.validateOptions({ amqp: null });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectAmqpMissingUrl.ua, () => {
    try {
      ConsumerValidate.validateOptions({ amqp: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectAmqpNoValidUrl.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        amqp: {
          url: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueue.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueMissingNestProperties.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueNoValidName.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          name: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueExchange.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueExchangeMissingNestProperties.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueExchangeNoValidName.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            name: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueExchangeOptions.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(
    ConsumerCaptions.incorrectQueueExchangeOptionsMissingNestProperties.ua,
    () => {
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
        expect(err).toHaveProperty('message');
      }
    },
  );

  it(ConsumerCaptions.incorrectQueueExchangeOptionsNoValidDurable.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: {
              durable: null,
            },
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueExchangeOptionsNoValidAutoDelete.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          exchange: {
            options: {
              autoDelete: null,
            },
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptions.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsMissingNestProperties.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsNoValidNoAck.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            noAck: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsNoValidExclusive.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            exclusive: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsNoValidDurable.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            durable: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsNoValidAutoDelete.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            autoDelete: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectQueueOptionsNoValidPrefetch.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        queue: {
          options: {
            prefetch: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessage.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessageMissingNestProperties.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessageOptions.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessageOptionsMissingNestProperties.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessageOptionsNoValidNoAck.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {
            noAck: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ConsumerCaptions.incorrectMessageOptionsNoValidExclusive.ua, () => {
    try {
      ConsumerValidate.validateOptions({
        message: {
          options: {
            exclusive: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  // it(ConsumerCaptions.validateCorrect.ua, () => {
  //   expect(
  //     ConsumerValidate.validateOptions({
  //       queue: {
  //         name: 'test',
  //         exchange: {
  //           name: 'amqp_test_exchange',
  //           mode: 'fanout',
  //           options: {
  //             durable: true,
  //             autoDelete: false,
  //           },
  //         },
  //         options: {
  //           noAck: false,
  //           exclusive: false,
  //           durable: true,
  //           autoDelete: false,
  //           prefetch: 1,
  //         },
  //       },
  //       // message: { options: { noAck: false, exclusive: false } },
  //       amqp: {
  //         url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg?heartbeat=60',
  //       },
  //     }),
  //   ).not.toBeDefined();
  // });
});
