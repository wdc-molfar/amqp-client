/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import { Middleware, yaml2js } from './lib';
import AmqpExplorer from './lib/infrastructure/amqp-explorer';
import { getMetrics } from './lib/utils/metrics';

const amqp = {
  url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg?heartbeat=60',
};

const exchange = {
  name: 'amqp_test_exchange',
};

const consumerOptions = {
  amqp,
  queue: {
    exchange,
  },
};

const publisherOptions = {
  amqp,
  exchange,
};

const schema = {
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'string',
    },
  },
  errorMessage: {
    type: 'The sended message should be a object',
    properties: {
      data: 'The sended message data should be a string',
    },
  },
};

const inputSchema = yaml2js(`
  type: object
  required:
    - data
  properties:
    data:
      type: string
  errorMessage:
    type: The consumed message should be a object
    properties:
      data: The consumed message data should be a string
`);

const run = async () => {
  const amqpExplorer = AmqpExplorer.getInstance();
  const consumer = await amqpExplorer.createConsumer(consumerOptions);
  await consumer
    .use(Middleware.Json.parse)
    .use([
      Middleware.MsgType,
      Middleware.MonitorMetrics,
      Middleware.WithoutMsgType,
    ])
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .use([
      Middleware.Schema.validator(inputSchema),
      Middleware.Error.Log,
      Middleware.Error.BreakChain,
      Middleware.Filter((msg) => msg.content && msg.content.data.endsWith('5')),
    ])
    .use(async (err, msg, next) => {
      console.log('Process:', msg.content);
    })
    .start();
  const publisher = await amqpExplorer.createPublisher(publisherOptions);
  publisher
    .use([
      Middleware.Schema.validator(schema),
      Middleware.Error.Log,
      Middleware.Error.BreakChain,
      Middleware.MsgType,
      Middleware.MonitorMetrics,
    ])
    .use((err, msg, next) => {
      console.log('Send:', msg.content);
      next();
    })
    .use(Middleware.Json.stringify);
  for (let i = 1; i <= 5; i++) {
    await publisher.send({
      data: `test message ${i}`,
    });
  }
  await publisher.send('hello');
  await publisher.send({ data: 10 });
  setTimeout(async () => {
    await publisher.close(amqpExplorer.closeConnection.bind(amqpExplorer));
    await consumer.close(amqpExplorer.closeConnection.bind(amqpExplorer));
    await getMetrics();
  }, 1000);
};

run();
