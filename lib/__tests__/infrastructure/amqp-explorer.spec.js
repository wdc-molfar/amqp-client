const amqplib = require('amqplib');
const AmqpExplorer = require('../../infrastructure/amqp-explorer');
const Publisher = require('../../infrastructure/publisher');
const Consumer = require('../../infrastructure/consumer');

jest.mock('../../infrastructure/consumer');
jest.mock('../../infrastructure/publisher');

const url = 'test_url';
const connectionCommonConfig = {
  connection: {
    heartbeat: 60,
  },
  clients: [],
};

describe('AmqpExplorer - testing class', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  jest.mock('amqplib', () => ({
    connect: jest.fn().mockImplementation((optionsUrl) => ({
      connection: `${optionsUrl}_connection`,
    })),
  }));

  it('should return correct instance', () => {
    const amqpExplorerFirst = AmqpExplorer.getInstance();
    const amqpExplorerSecond = AmqpExplorer.getInstance();
    expect(amqpExplorerFirst).toEqual(amqpExplorerSecond);
    expect(AmqpExplorer.pool).toEqual(expect.anything(Map));
  });

  it('should return correct connection config by url', () => {
    const pool = new Map();
    pool.set(url, connectionCommonConfig);
    AmqpExplorer.pool = pool;
    const amqpExplorer = AmqpExplorer.getInstance();

    expect(amqpExplorer.getConnectionConfig(url)).toEqual(
      connectionCommonConfig,
    );
  });

  it('should return correct connection config by client', () => {
    const amqpExplorer = AmqpExplorer.getInstance();
    amqpExplorer.setConnectionConfig(url, connectionCommonConfig);
    expect(AmqpExplorer.pool.get(url)).toEqual(connectionCommonConfig);
  });

  it('should return correct connection config by url', () => {
    const client = 'test_client';
    const connectionConfig = {
      ...connectionCommonConfig,
      clients: [client],
    };
    const pool = new Map();
    pool.set(url, connectionConfig);
    AmqpExplorer.pool = pool;
    const amqpExplorer = AmqpExplorer.getInstance();

    expect(amqpExplorer.getClientConnection(client)).toEqual([
      url,
      connectionConfig,
    ]);
  });

  it.skip('should create or get existing connection for client', async () => {
    const clientFirst = 'test_client_first';
    const clientSecond = 'test_client_second';
    const optionsFirst = {
      url: 'amqp:localhost/first',
    };
    const optionsSecond = {
      url: 'amqp:localhost/second',
    };

    const amqpExplorer = AmqpExplorer.getInstance();
    const resultFirst = await amqpExplorer.getConnection(
      clientFirst,
      optionsFirst,
    );
    const resultSecond = await amqpExplorer.getConnection(
      clientSecond,
      optionsFirst,
    );
    const resultThird = await amqpExplorer.getConnection(
      clientFirst,
      optionsSecond,
    );
    const resultFourth = await amqpExplorer.getConnection(
      clientSecond,
      optionsSecond,
    );
    expect(resultFirst).toEqual(
      expect.objectContaining({
        connection: 'amqp:localhost/first_connection',
      }),
    );
    expect(resultSecond).toEqual(
      expect.objectContaining({
        connection: 'amqp:localhost/first_connection',
      }),
    );
    expect(resultThird).toEqual(
      expect.objectContaining({
        connection: 'amqp:localhost/second_connection',
      }),
    );
    expect(resultFourth).toEqual(
      expect.objectContaining({
        connection: 'amqp:localhost/second_connection',
      }),
    );
  });

  it.skip('should create correct publisher', async () => {
    const options = {
      amqp: {
        url: 'amqp:localhost/my',
      },
      exchange: { name: 'amqp_test_exchange' },
    };
    const amqpExplorer = AmqpExplorer.getInstance();
    const publisher = await amqpExplorer.createPublisher(options);

    expect(publisher).toBeDefined();
    expect(Publisher).toBeCalledWith(
      expect.objectContaining({
        connection: 'amqp:localhost/my_connection',
      }),
      expect.anything(String),
      expect.objectContaining({
        amqp: options.amqp,
        exchange: expect.objectContaining(options.exchange),
      }),
    );
  });

  it.skip('should create correct consumer', async () => {
    const options = {
      amqp: {
        url: 'amqp:localhost/my',
      },
      queue: {
        exchange: {
          name: 'amqp_test_exchange',
        },
      },
    };
    const amqpExplorer = AmqpExplorer.getInstance();
    const consumer = await amqpExplorer.createConsumer(options);

    expect(consumer).toBeDefined();
    expect(Consumer).toBeCalledWith(
      expect.objectContaining({
        connection: 'amqp:localhost/my_connection',
      }),
      expect.anything(String),
      expect.objectContaining({
        amqp: options.amqp,
        queue: expect.objectContaining({
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
    AmqpExplorer.pool = pool;
    const amqpExplorer = AmqpExplorer.getInstance();
    await amqpExplorer.closeConnection(client);

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
    AmqpExplorer.pool = pool;
    const amqpExplorer = AmqpExplorer.getInstance();
    await amqpExplorer.clearAndShutdown();

    expect(connectionConfig.connection.close).toBeCalledTimes(1);
    expect(AmqpExplorer.pool.size).toBe(0);
  });

  it('should return correct size of pool of connection configs', () => {
    const pool = new Map();
    pool.set(url, connectionCommonConfig);
    AmqpExplorer.pool = pool;
    const amqpExplorer = AmqpExplorer.getInstance();

    expect(amqpExplorer.size()).toEqual(1);
  });
});
