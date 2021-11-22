const amqp = require('amqplib');
const AmqpManager = require('../../lib/infrastructure/amqp-manager');
const Publisher = require('../../lib/infrastructure/publisher');
const Consumer = require('../../lib/infrastructure/consumer');

jest.mock('../../lib/infrastructure/consumer');
jest.mock('../../lib/infrastructure/publisher');

const url = 'test_url';
const connectionCommonConfig = {
  connection: {
    heartbeat: 60,
  },
  clients: [],
};

describe('AmqpManager - testing class', () => {
  let AmqpManagerClone;
  beforeEach(() => {
    AmqpManagerClone = AmqpManager.newInstance();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return correct connection config by url', () => {
    const pool = new Map();
    pool.set(url, connectionCommonConfig);
    AmqpManagerClone.pool = pool;

    expect(AmqpManagerClone.getConnectionConfig(url)).toEqual(
      connectionCommonConfig,
    );
  });

  it('should return correct connection config by client', () => {
    AmqpManagerClone.setConnectionConfig(url, connectionCommonConfig);

    expect(AmqpManagerClone.pool.get(url)).toEqual(connectionCommonConfig);
  });

  it('should return correct connection config by url', () => {
    const client = 'test_client';
    const connectionConfig = {
      ...connectionCommonConfig,
      clients: [client],
    };
    const pool = new Map();
    pool.set(url, connectionConfig);
    AmqpManagerClone.pool = pool;

    expect(AmqpManagerClone.getClientConnection(client)).toEqual([
      url,
      connectionConfig,
    ]);
  });

  it('should create or get existing connection for client', async () => {
    const clientFirst = 'test_client_first';
    const clientSecond = 'test_client_second';
    const options = {
      url: 'amqp:localhost/first',
    };

    jest.spyOn(amqp, 'connect').mockResolvedValueOnce({
      connection: options,
    });

    const resultFirst = await AmqpManagerClone.getConnection(
      clientFirst,
      options,
    );

    const resultSecond = await AmqpManagerClone.getConnection(
      clientSecond,
      options,
    );

    expect(resultFirst).toEqual(
      expect.objectContaining({
        connection: options,
      }),
    );

    expect(resultSecond).toEqual(
      expect.objectContaining({
        connection: options,
      }),
    );
  });

  it('should create correct publisher', async () => {
    const options = {
      amqp: {
        url: 'amqp:localhost/my',
      },
      exchange: { name: 'amqp_test_exchange' },
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce({});
    const publisher = await AmqpManagerClone.createPublisher(options);

    expect(publisher).toBeDefined();
    expect(Publisher).toBeCalledWith(
      AmqpManagerClone,
      expect.objectContaining({
        amqp: options.amqp,
        exchange: expect.objectContaining(options.exchange),
      }),
    );
  });

  it('should create correct consumer', async () => {
    const options = {
      amqp: {
        url: 'amqp:localhost/my',
      },
      queue: {
        name: 'test',
        exchange: {
          name: 'amqp_test_exchange',
        },
      },
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce({});
    const consumer = await AmqpManagerClone.createConsumer(options);

    expect(consumer).toBeDefined();
    expect(Consumer).toBeCalledWith(
      AmqpManagerClone,
      expect.objectContaining({
        amqp: options.amqp,
        queue: expect.objectContaining({
          name: 'test',
          exchange: expect.objectContaining(options.queue.exchange),
        }),
      }),
    );
  });

  it('should close correct connection by correct client', async () => {
    const client = 'test_client';
    const connectionConfig = {
      ...connectionCommonConfig,
      connection: {
        ...connectionCommonConfig.connection,
        close: jest.fn(),
      },
      clients: [client],
    };
    const pool = new Map();
    pool.set(url, connectionConfig);
    AmqpManagerClone.pool = pool;

    await AmqpManagerClone.closeConnection(client);

    expect(connectionConfig.connection.close).toBeCalledTimes(1);
  });

  it('should close correct connection for all clientz', async () => {
    const clientFirst = 'test_client_first';
    const clientSecond = 'test_client_second';
    const connectionConfig = {
      ...connectionCommonConfig,
      connection: {
        ...connectionCommonConfig.connection,
        close: jest.fn().mockResolvedValue(),
      },
      clients: [clientFirst, clientSecond],
    };
    const pool = new Map();
    pool.set(url, connectionConfig);
    AmqpManagerClone.pool = pool;

    await AmqpManagerClone.clearAndShutdown();

    expect(connectionConfig.connection.close).toBeCalledTimes(1);
    expect(AmqpManagerClone.pool.size).toBe(0);
  });

  it('should return correct size of pool of connection configs', () => {
    const pool = new Map();
    pool.set(url, connectionCommonConfig);
    AmqpManagerClone.pool = pool;

    expect(AmqpManagerClone.size()).toEqual(1);
  });
});
