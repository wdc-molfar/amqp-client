/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
const amqp = require('amqplib');
const { Middlewares } = require('../../lib');
const AmqpManager = require('../../lib/infrastructure/amqp-manager');
const Publisher = require('../../lib/infrastructure/publisher');
const Middleware = require('../../lib/middlewares/wrapper');
const PublisherCaptions = require('./captions/publisher');

jest.mock('../../lib/middlewares/wrapper');

const options = {
  exchange: {
    name: 'amqp_test_exchange',
    mode: 'fanout',
    options: { durable: true, autoDelete: false },
  },
  message: { options: { persistent: true } },
  amqp: {
    url: 'amqp:localhost',
  },
};

const content = 'test_content';

describe(PublisherCaptions.publisherDescription.ua, () => {
  let AmqpManagerClone;
  beforeEach(() => {
    AmqpManagerClone = AmqpManager.newInstance();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const mockCommonChannel = {
    assertExchange: jest.fn(),
  };
  const mockCommonConnection = {
    close: jest.fn(),
  };

  it(PublisherCaptions.correctInstance.ua, async () => {
    const mockConnection = {
      ...mockCommonConnection,
      connection: {
        heartbeat: 60,
      },
      createChannel: jest.fn().mockResolvedValueOnce(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const publisher = new Publisher(AmqpManagerClone, options);
    await publisher.moduleInit();

    expect(publisher.connection).toEqual(
      expect.objectContaining({
        connection: {
          heartbeat: 60,
        },
      }),
    );
    expect(publisher.client).toEqual(expect.any(String));
    expect(publisher.options).toEqual(
      expect.objectContaining({
        amqp: options.amqp,
      }),
    );
  });

  it(PublisherCaptions.initializeDependencies.ua, async () => {
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValue(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValue(mockConnection);

    const publisher = new Publisher(AmqpManagerClone, options);
    await publisher.moduleInit();

    expect(publisher.connection.createChannel).toHaveBeenCalled();
    expect(publisher.channel).toBeDefined();
    expect(publisher.channel.assertExchange).toHaveBeenCalledWith(
      options.exchange.name,
      options.exchange.mode,
      options.exchange.options,
    );
    expect(Middleware).toHaveBeenCalledWith(expect.anything(Function));
    expect(publisher.middleware).toBeDefined();
  });

  it(PublisherCaptions.callbackMiddleware.ua, async () => {
    Middleware.mockImplementation(() => ({
      use: jest.fn().mockReturnThis(),
    }));
    const publisher = new Publisher(AmqpManagerClone, options);
    await publisher.moduleInit();
    const result = publisher.use(Middlewares.Json.parse);

    expect(publisher.middleware.use).toHaveBeenCalledWith(
      Middlewares.Json.parse,
    );
    expect(result).toEqual(publisher);
  });

  it(PublisherCaptions.executeLogic.ua, async () => {
    const mockChannel = {
      ...mockCommonChannel,
      publish: jest.fn(),
    };
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const executeCallback = jest.fn().mockImplementation((err, msg, next) => {
      mockChannel.publish(options.exchange.name, '', Buffer.from(msg.content));
      next();
    });
    Middleware.mockImplementation(() => ({
      execute: jest.fn().mockImplementation((args) => {
        executeCallback(null, args, jest.fn);
      }),
    }));

    const publisher = new Publisher(AmqpManagerClone, options);
    await publisher.moduleInit();
    await publisher.send(content);

    expect(publisher.middleware.execute).toHaveBeenCalledWith({
      content,
    });
    expect(executeCallback).toHaveBeenCalledWith(
      null,
      {
        content,
      },
      expect.any(Function),
    );
  });

  it(PublisherCaptions.closeChannelConnection.ua, async () => {
    const mockChannel = {
      ...mockCommonChannel,
      close: jest.fn(),
    };
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const publisher = new Publisher(AmqpManagerClone, options);
    await publisher.moduleInit();
    await publisher.close();

    expect(publisher.channel.close).toHaveBeenCalled();
    expect(AmqpManagerClone.pool.get(options.amqp.url)).toEqual(
      expect.objectContaining({
        clients: [],
      }),
    );
  });
});
