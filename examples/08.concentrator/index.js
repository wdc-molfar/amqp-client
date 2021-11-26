/* eslint-disable no-unused-vars */

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('../../lib');

const listenerOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './listener.yaml')).toString(),
);

const producerOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './producer.yaml')).toString(),
);

const run = async () => {
  const producerPipe = (producerId) => [
    Middlewares.Schema.validator(producerOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log(`Producer ${producerId} send `, msg.content);
      next();
    },
  ];

  const listenerPipe = [
    Middlewares.Json.parse,
    Middlewares.Schema.validator(listenerOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,

    (err, msg, next) => {
      console.log('Listener starts', msg.content);
      next();
    },

    (err, msg, next) => {
      setTimeout(() => {
        console.log('Listener complete', msg.content);
      }, msg.content.timeout);
    },
  ];

  const producer1 = await AmqpManager.createPublisher(producerOptions);
  await producer1.use(producerPipe(1));

  const producer2 = await AmqpManager.createPublisher(producerOptions);
  await producer2.use(producerPipe(2));

  const listener = await AmqpManager.createConsumer(listenerOptions);
  await listener.use(listenerPipe).start();

  producer1.send({
    id: 0,
    producer: 1,
    timeout: Math.round(Math.random() * 1000) + 4000,
  });

  producer2.send({
    id: 0,
    producer: 2,
    timeout: Math.round(Math.random() * 1000) + 4000,
  });

  for (let i = 1; i < 6; i++) {
    producer1.send({
      id: i,
      producer: 1,
      timeout: Math.round(Math.random() * 1000) + 200,
    });

    producer2.send({
      id: i,
      producer: 2,
      timeout: Math.round(Math.random() * 1000) + 200,
    });
  }

  setTimeout(async () => {
    await producer1.close();
    await producer2.close();
    await listener.close();
  }, 10000);
};

run();
