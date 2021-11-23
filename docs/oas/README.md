# Розроблення модуля

## Приклади використання

### Завантаження залежності

```sh
    npm install --save wdc-molfar
```

### Базовий приклад

@startuml

  queue  "test" <<Queue>> as Queue
  queue  "amqp_test_exchange" <<Exchange>> as Exchange #aaeeaa 
  
  component  "consumer" <<Consumer>> as Consumer 
  component  "producer" <<Producer>> as Producer #aaeeaa

    Producer -> Exchange
    Exchange -> Queue
    Queue -> Consumer

@enduml  


```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: initiator
    
    exchange:
        name: initiator
        mode: fanout

    options:
        noAck: true
        

```


```js

const { Consumer, Publisher } = require('@molfar/amqp-client');

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

```


```sh

Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 31 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 32 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 33 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 34 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 35 22 7d>
Consume:  <Buffer 22 68 65 6c 6c 6f 22>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 31 30 7d>  

```
### Ланцюжки оброблення повідомлень

```js

const { Consumer, Publisher } = require('@molfar/amqp-client');

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
      msg.content = JSON.parse(msg.content);
      next();
    })
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .use(async (err, msg, next) => {
      console.log('Process:', msg.content);
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

```

```sh

Consume:  { data: 'test message 1' }
Process: { data: 'test message 1' }
Consume:  { data: 'test message 2' }
Process: { data: 'test message 2' }
Consume:  { data: 'test message 3' }
Consume:  { data: 'test message 4' }
Process: { data: 'test message 3' }
Process: { data: 'test message 4' }
Consume:  { data: 'test message 5' }
Consume:  hello
Process: { data: 'test message 5' }
Process: hello
Consume:  { data: 10 }
Process: { data: 10 }

```

### Стандартні обробники повідомлень

```js 

const { Consumer, Publisher, Middlewares } = require('@molfar/amqp-client');

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
    .use(Middlewares.Json.parse)
    .use((err, msg, next) => {
      console.log('Consume: ', msg.content);
      msg.ack();
      next();
    })
    .use(
      Middlewares.Filter(
        (msg) => msg.content && msg.content.data.endsWith('5'),
      ),
    )
    .use((err, msg, next) => {
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

```

```sh

Send: { data: 'test message 1' }
Send: { data: 'test message 2' }
Send: { data: 'test message 3' }
Send: { data: 'test message 4' }
Send: { data: 'test message 5' }
Send: hello
Send: { data: 10 }
Consume:  { data: 'test message 1' }
Consume:  { data: 'test message 2' }
Consume:  { data: 'test message 3' }
Consume:  { data: 'test message 4' }
Consume:  { data: 'test message 5' }
Process: { data: 'test message 5' }
Consume:  hello
Process: hello
Consume:  { data: 10 }
Process: { data: 10 }     

```
## Валідація повідомлень

На стороні публікувальника:

```js

const { Consumer, Publisher, Middlewares } = require('@molfar/amqp-client');

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
    .use([
      Middlewares.Schema.validator(schema),
      Middlewares.Error.Log,
      Middlewares.Error.BreakChain,
    ])
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

```

```sh
Send: { data: 'test message 1' }
Send: { data: 'test message 2' }
Send: { data: 'test message 3' }
Send: { data: 'test message 4' }
Send: { data: 'test message 5' }
Error: Bad message format.
"hello"
On the path "#": The sended message should be a object
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at Publisher.send (G:\bachelor\amqp-client\lib\infrastructure\publisher.js:63:30)
    at run (G:\bachelor\amqp-client\examples\use-validation\publisher\index.js:80:19)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
Error: Bad message format.
{"data":10}
On the path "/data": The sended message data should be a string
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at Publisher.send (G:\bachelor\amqp-client\lib\infrastructure\publisher.js:63:30)
    at run (G:\bachelor\amqp-client\examples\use-validation\publisher\index.js:81:19)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
Consume:  { data: 'test message 1' }
Consume:  { data: 'test message 2' }
Consume:  { data: 'test message 3' }
Consume:  { data: 'test message 4' }
Consume:  { data: 'test message 5' }
Process: { data: 'test message 5' }

```

На стороні споживача: 

```js

const { Consumer, Publisher, Middleware, yaml2js } = require('@molfar/amqp-client');

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

```

```sh

Send: { data: 'test message 1' }
Send: { data: 'test message 2' }
Send: { data: 'test message 3' }
Send: { data: 'test message 4' }
Send: { data: 'test message 5' }
Send: hello
Send: { data: 10 }
Consume:  { data: 'test message 1' }
Consume:  { data: 'test message 2' }
Consume:  { data: 'test message 3' }
Consume:  { data: 'test message 4' }
Consume:  { data: 'test message 5' }
Process: { data: 'test message 5' }
Consume:  hello
Error: Bad message format.
"hello"
On the path "#": The consumed message should be a object
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async G:\bachelor\amqp-client\lib\infrastructure\consumer.js:78:13
Consume:  { data: 10 }
Error: Bad message format.
{"data":10}
On the path "/data": The consumed message data should be a string
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async G:\bachelor\amqp-client\lib\infrastructure\consumer.js:78:13  

```
## Використання метрик

```js 

const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');
const { Counter } = require('prom-client');

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

```

```sh

Send: { data: 'test message 1' }
Send: { data: 'test message 2' }
Send: { data: 'test message 3' }
Send: { data: 'test message 4' }
Send: { data: 'test message 5' }
Error: Bad message format.
"hello"
On the path "#": The sended message should be a object
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Publisher.send (G:\bachelor\amqp-client\lib\infrastructure\publisher.js:63:7)
    at async run (G:\bachelor\amqp-client\examples\use-metrics\index.js:182:3)
Error: Bad message format.
{"data":10}
On the path "/data": The sended message data should be a string
    at Array.<anonymous> (G:\bachelor\amqp-client\lib\middlewares\schema.js:12:13)
    at Middleware.execute (G:\bachelor\amqp-client\lib\middlewares\wrapper.js:35:54)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async Publisher.send (G:\bachelor\amqp-client\lib\infrastructure\publisher.js:63:7)
    at async run (G:\bachelor\amqp-client\examples\use-metrics\index.js:183:3)
Consume:  { data: 'test message 1' }
Consume:  { data: 'test message 2' }
Consume:  { data: 'test message 3' }
Consume:  { data: 'test message 4' }
Consume:  { data: 'test message 5' }
Process: { data: 'test message 5' }
Metrics:
[
 {
  "help": "Stages of producer process",
  "name": "p_stages",
  "type": "counter",
  "values": [
   {
    "value": 7,
    "labels": {
     "stage": "generated"
    }
   },
   {
    "value": 5,
    "labels": {
     "stage": "validated"
    }
   },
   {
    "value": 5,
    "labels": {
     "stage": "sended"
    }
   },
   {
    "value": 2,
    "labels": {
     "stage": "validation-errors"
    }
   }
  ],
  "aggregator": "sum"
 },
 {
  "help": "Stages of consumer process",
  "name": "c_stages",
  "type": "counter",
  "values": [
   {
    "value": 5,
    "labels": {
     "stage": "consumed"
    }
   },
   {
    "value": 5,
    "labels": {
     "stage": "validated"
    }
   },
   {
    "value": 1,
    "labels": {
     "stage": "processed"
    }
   }
  ],
  "aggregator": "sum"
 },
 {
  "help": "Counter of Consumed messages",
  "name": "consumed_messages",
  "type": "counter",
  "values": [
   {
    "value": 5,
    "labels": {}
   }
  ],
  "aggregator": "sum"
 },
 {
  "help": "Counter of Produced messages",
  "name": "produced_messages",
  "type": "counter",
  "values": [
   {
    "value": 5,
    "labels": {}
   }
  ],
  "aggregator": "sum"
 }
]    

```


## Часткове оброблення та композиция результатів

@startuml

    frame  initiator {
      component  "initiator" <<Producer>> as Initiator #aaeeaa
    }
  
    queue  "messages" <<Exchange>> as Messages #aaeeaa 
    queue  "messages_ner" <<Queue>> as Messages_ner
    queue  "messages_sa" <<Queue>> as Messages_sa
    
    Initiator -> Messages
    Messages --> Messages_sa
    Messages --> Messages_ner

    frame partial_sa {
      component  "listener" <<Consumer>> as Listener_sa
      component  "producer" <<Producer>> as Producer_sa #aaeeaa
      Listener_sa ..> Producer_sa          
    }
    
    frame partial_ner {
      component  "listener" <<Consumer>> as Listener_ner
      component  "producer" <<Producer>> as Producer_ner #aaeeaa
      Listener_ner ..> Producer_ner          
    }
    
    Messages_ner --> Listener_ner
    Messages_sa --> Listener_sa
    
    queue  "composer_input" <<Exchange>> as Composer_input #aaeeaa 
    
    Producer_ner --> Composer_input
    Producer_sa --> Composer_input
    
    queue "composer_input" <<Queue>> as CIQ
    
    Composer_input -> CIQ
    
    frame composer {
        component  "listener" <<Consumer>> as CL
    }
    
    CIQ --> CL

@enduml  