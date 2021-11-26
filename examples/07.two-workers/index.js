/* eslint-disable max-len */
/* eslint-disable no-unused-vars */

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('../../lib');

const consumerOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './worker.yaml')).toString(),
);
const publisherOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './scheduler.yaml')).toString(),
);

const run = async () => {
  const schedullerPipe = [
    Middlewares.Schema.validator(publisherOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
  ];

  const workerPipe = (workerId) => [
    Middlewares.Json.parse,

    (err, msg, next) => {
      console.log(
        `Worker ${workerId} fetch task ${msg.content.id}, ${msg.content.timeout}`,
      );
      next();
    },

    Middlewares.Schema.validator(consumerOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,

    (err, msg, next) => {
      setTimeout(() => {
        console.log(
          `Worker ${workerId} process ${msg.content.id} : ${msg.content.timeout}`,
        );
        msg.ack();
      }, msg.content.timeout);
    },
  ];

  const scheduler = await AmqpManager.createPublisher(publisherOptions);
  await scheduler.use(schedullerPipe);

  const worker1 = await AmqpManager.createConsumer(consumerOptions);
  await worker1.use(workerPipe(1)).start();

  const worker2 = await AmqpManager.createConsumer(consumerOptions);
  await worker2.use(workerPipe(2)).start();

  scheduler.send({
    id: 0,
    timeout: Math.round(Math.random() * 1000) + 4000,
  });

  for (let i = 1; i < 6; i++) {
    scheduler.send({
      id: i,
      timeout: Math.round(Math.random() * 1000) + 200,
    });
  }

  setTimeout(async () => {
    await scheduler.close();
    await worker1.close();
    await worker2.close();
  }, 10000);
};

run();
