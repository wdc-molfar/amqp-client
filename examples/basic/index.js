/* eslint-disable no-param-reassign */
const { AmqpManager } = require('../../lib');

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

const run = async () => {
  const consumer = await AmqpManager.createConsumer(consumerOptions);

  await consumer
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .start();

  const publisher = await AmqpManager.createPublisher(publisherOptions);

  publisher.use((err, msg, next) => {
    msg.content = JSON.stringify(msg.content);
    next();
  });

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
