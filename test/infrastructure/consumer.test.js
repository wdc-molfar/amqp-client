const amqp = require('amqplib');
const { Middlewares } = require('../../lib');
const AmqpManager = require('../../lib/infrastructure/amqp-manager');
const Consumer = require('../../lib/infrastructure/consumer');
const Middleware = require('../../lib/middlewares/wrapper');

jest.mock('../../lib/middlewares/wrapper');

const options = {
  queue: {
    name: null,
    exchange: {
      name: 'amqp_test_exchange',
      mode: 'fanout',
      options: {
        durable: true,
        autoDelete: false,
      },
    },
    options: {
      noAck: false,
      exclusive: false,
      durable: true,
      autoDelete: false,
      prefetch: 1,
    },
  },
  message: { options: { noAck: false, exclusive: false } },
  amqp: {
    url: 'amqp:localhost',
  },
};

const queue = 'test_queue';
const content = 'test_content';

describe('Consumer - testing class', () => {
  let AmqpManagerClone;
  beforeEach(() => {
    AmqpManagerClone = AmqpManager.newInstance();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  const mockCommonChannel = {
    assertExchange: jest.fn(),
    assertQueue: jest.fn().mockReturnValue({ queue }),
    bindQueue: jest.fn(),
  };
  const mockCommonConnection = {
    close: jest.fn(),
  };

  it('should return correct instance', async () => {
    const mockConnection = {
      ...mockCommonConnection,
      connection: {
        heartbeat: 60,
      },
      createChannel: jest.fn().mockResolvedValueOnce(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const consumer = new Consumer(AmqpManagerClone, options);
    await consumer.moduleInit();

    expect(consumer.connection).toEqual(
      expect.objectContaining({
        connection: {
          heartbeat: 60,
        },
      }),
    );
    expect(consumer.client).toEqual(expect.any(String));
    expect(consumer.options).toEqual(
      expect.objectContaining({
        amqp: options.amqp,
      }),
    );
  });

  it('should initialize consumer dependencies correctly', async () => {
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const consumer = new Consumer(AmqpManagerClone, options);
    await consumer.moduleInit();

    expect(consumer.connection.createChannel).toHaveBeenCalled();
    expect(consumer.channel).toBeDefined();
    expect(consumer.channel.assertExchange).toHaveBeenCalledWith(
      options.queue.exchange.name,
      options.queue.exchange.mode,
      options.queue.exchange.options,
    );
    expect(consumer.channel.assertQueue).toHaveBeenCalledWith(
      null,
      options.queue.options,
    );
    expect(consumer.queue).toEqual('test_queue');
    expect(consumer.channel.bindQueue).toHaveBeenCalledWith(
      queue,
      options.queue.exchange.name,
      '',
    );
    expect(consumer.middleware).toBeDefined();
  });

  it('should save callback to middleware', async () => {
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    Middleware.mockImplementation(() => ({
      use: jest.fn().mockReturnThis(),
    }));

    const consumer = new Consumer(AmqpManagerClone, options);
    await consumer.moduleInit();
    const result = consumer.use(Middlewares.Json.parse);

    expect(consumer.middleware.use).toHaveBeenCalledWith(
      Middlewares.Json.parse,
    );
    expect(result).toEqual(consumer);
  });

  it('should execute logic correctly', async () => {
    const mockChannel = {
      ...mockCommonChannel,
      consume: jest.fn().mockImplementation(async (queueParam, callback) => {
        await callback({ content });
      }),
      ack: jest.fn().mockImplementation((msg) => msg),
      nack: jest.fn().mockImplementation((msg) => msg),
    };
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const executeCallback = jest.fn();
    Middleware.mockImplementation(() => ({
      execute: jest.fn().mockImplementation((args) => {
        executeCallback(null, args, jest.fn);
        args.ack();
        args.nack();
      }),
    }));

    const consumer = new Consumer(AmqpManagerClone, options);
    await consumer.moduleInit();
    await consumer.start();

    expect(consumer.channel.consume).toHaveBeenCalledWith(
      queue,
      expect.anything(),
    );
    expect(consumer.middleware.execute).toHaveBeenCalledWith({
      content,
      ack: expect.any(Function),
      nack: expect.any(Function),
    });
    expect(executeCallback).toHaveBeenCalledWith(
      null,
      {
        content,
        ack: expect.any(Function),
        nack: expect.any(Function),
      },
      expect.any(Function),
    );
  });

  it('should close existing channel and connection', async () => {
    const mockChannel = {
      ...mockCommonChannel,
      close: jest.fn(),
    };
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const consumer = new Consumer(AmqpManagerClone, options);
    await consumer.moduleInit();
    await consumer.close();

    expect(consumer.channel.close).toHaveBeenCalled();
    expect(AmqpManagerClone.pool.get(options.amqp.url)).toEqual(
      expect.objectContaining({
        clients: [],
      }),
    );
  });
});
