/* eslint-disable no-unused-vars */

const { Counter } = require('prom-client');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('../../lib');

const amqp = {
  url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg?heartbeat=60',
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
  const pStages = new Counter({
    name: 'p_stages',
    help: 'Stages of producer process',
    labelNames: ['stage'],
  });

  const cStages = new Counter({
    name: 'c_stages',
    help: 'Stages of consumer process',
    labelNames: ['stage'],
  });

  const consumer = await AmqpManager.createConsumer(consumerOptions);

  await consumer
    .use(Middlewares.Json.parse)
    .use(
      Middlewares.Metric({
        metric: new Counter({
          name: 'consumed_messages',
          help: 'Counter of Consumed messages',
        }),

        callback: (err, msg, metric) => {
          metric.inc();
        },
      }),
    )
    .use(
      Middlewares.Metric({
        metric: cStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'consumed' });
        },
      }),
    )
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .use([
      Middlewares.Schema.validator(inputSchema),
      Middlewares.Error.Log,
      Middlewares.Metric({
        metric: cStages,
        callback: (err, msg, metric) => {
          if (err) metric.inc({ stage: 'validation-errors' });
        },
      }),
      Middlewares.Error.BreakChain,
      Middlewares.Metric({
        metric: cStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'validated' });
        },
      }),
      Middlewares.Filter(
        (msg) => msg.content && msg.content.data.endsWith('5'),
      ),
      Middlewares.Metric({
        metric: cStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'processed' });
        },
      }),
    ])
    .use(async (err, msg, next) => {
      console.log('Process:', msg.content);
    })
    .start();

  const publisher = await AmqpManager.createPublisher(publisherOptions);
  publisher
    .use([
      Middlewares.Metric({
        metric: pStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'generated' });
        },
      }),
      Middlewares.Schema.validator(schema),
      Middlewares.Error.Log,
      Middlewares.Metric({
        metric: pStages,
        callback: (err, msg, metric) => {
          if (err) metric.inc({ stage: 'validation-errors' });
        },
      }),
      Middlewares.Error.BreakChain,
      Middlewares.Metric({
        metric: pStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'validated' });
        },
      }),
      Middlewares.Metric({
        metric: new Counter({
          name: 'produced_messages',
          help: 'Counter of Produced messages',
        }),
        callback: (err, msg, metric) => {
          metric.inc();
        },
      }),
    ])
    .use((err, msg, next) => {
      console.log('Send:', msg.content);
      next();
    })
    .use(Middlewares.Json.stringify)
    .use(
      Middlewares.Metric({
        metric: pStages,
        callback: (err, msg, metric) => {
          metric.inc({ stage: 'sended' });
        },
      }),
    );

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
    const metrics = await getMetrics();
    console.log('Metrics:');
    console.log(JSON.stringify(metrics, null, ' '));
  }, 1000);
};

run();
