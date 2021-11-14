/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import { v4 } from 'uuid';
import amqp from 'amqplib';
import amqpMock from 'mock-amqplib';
import { Middlewares } from '../..';
import Publisher from '../../infrastructure/publisher';
import Middleware from '../../middlewares/wrapper';

jest.mock('../../middlewares/wrapper');

const client = v4();

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

describe('Consumer - testing class', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  const mockCommonChannel = {
    assertExchange: jest.fn(),
  };
  const mockCommonConnection = {
    close: jest.fn(),
  };

  it('should return correct instance', () => {
    const publisher = new Publisher(
      {
        connection: {
          heartbeat: 60,
        },
      },
      v4(),
      {
        amqp: options.amqp,
      },
    );
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

  it('should initialize consumer dependencies correctly', async () => {
    const mockConnection = {
      ...mockCommonConnection,
      createChannel: jest.fn().mockResolvedValueOnce(mockCommonChannel),
    };
    jest.spyOn(amqp, 'connect').mockResolvedValueOnce(mockConnection);

    const connection = await amqp.connect(options.amqp);
    const publisher = new Publisher(connection, client, options);

    await publisher.moduleInit();
    expect(connection.createChannel).toHaveBeenCalled();
    expect(publisher.channel).toBeDefined();
    expect(publisher.channel.assertExchange).toHaveBeenCalledWith(
      options.exchange.name,
      options.exchange.mode,
      options.exchange.options,
    );
    expect(Middleware).toHaveBeenCalledWith(expect.anything(Function));
    expect(publisher.middleware).toBeDefined();
  });

  it('should save callback to middleware', async () => {
    Middleware.mockImplementation(() => ({
      use: jest.fn().mockReturnThis(),
    }));
    const connection = await amqpMock.connect(options.amqp);
    const publisher = new Publisher(connection, client, options);
    await publisher.moduleInit();
    const result = publisher.use(Middlewares.Json.parse);
    expect(publisher.middleware.use).toHaveBeenCalledWith(
      Middlewares.Json.parse,
    );
    expect(result).toEqual(publisher);
  });

  it('should execute logic correctly', async () => {
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

    const connection = await amqp.connect(options.amqp);
    const publisher = new Publisher(connection, client, options);
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
    const closeCallback = jest.fn();

    const connection = await amqp.connect(options.amqp);
    const publisher = new Publisher(connection, client, options);
    await publisher.moduleInit();
    await publisher.close(closeCallback);

    expect(publisher.channel.close).toHaveBeenCalled();
    expect(closeCallback).toHaveBeenCalledWith(client);
  });
});
