/* eslint-disable no-unused-vars */
const { AmqpManager, Middlewares, yaml2js } = require('../../../lib');

const amqp = {
  url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg',
};

const exchange = {
  name: 'amqp_test_exchange',
};

const consumerOptions = {
  amqp,
  queue: {
    name: 'test',
    exchange,
  },
};

const publisherOptions = {
  amqp,
  exchange,
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
  const consumer = await AmqpManager.createConsumer(consumerOptions);

  await consumer
    .use(Middlewares.Json.parse)
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .use([
      Middlewares.Schema.validator(inputSchema),
      Middlewares.Error.Log,
      Middlewares.Error.BreakChain,
      Middlewares.Filter(
        (msg) => msg.content && msg.content.data.endsWith('5'),
      ),
    ])
    .use(async (err, msg, next) => {
      console.log('Process:', msg.content);
    })
    .start();

  const publisher = await AmqpManager.createPublisher(publisherOptions);
  publisher
    .use((err, msg, next) => {
      console.log('Send:', msg.content);
      next();
    })
    .use(Middlewares.Json.stringify);

  for (let i = 1; i <= 5; i++) {
    await publisher.send({
      data: `test message ${i}`,
    });
  }

  await publisher.send('hello');
  await publisher.send({ data: 10 });

  setTimeout(async () => {
    await publisher.close();
    await consumer.close();
  }, 1000);
};

run();
