# Розроблення модуля

## Приклади використання

### Завантаження залежності

```sh
  npm install --save wdc-molfar
```

### 1. Базовий приклад

##### Створюємо інстанси publisher і consumer за допомогою базових і кастомних параметрів для підключення та відправляємо 5 тестових повідомлень, які отримуємо через логування в consumer у Buffer форматі.

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
##### Результат

```sh

Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 31 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 32 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 33 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 34 22 7d>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 22 74 65 73 74 20 6d 65 73 73 61 67 65 20 35 22 7d>
Consume:  <Buffer 22 68 65 6c 6c 6f 22>
Consume:  <Buffer 7b 22 64 61 74 61 22 3a 31 30 7d>  

```
### 2. Ланцюжки оброблення повідомлень
##### Окрім попереднього пункту про ініціалізацію publisher-consumer інстансів додається ланцюжок з колбеків, які виконуються послідовно і пропускають через себе 3 параметри: помилка, дані, колбек виклику наступної функції по черзі. 

@startuml

component  "consumer" <<Consumer>> as Consumer 
component  "producer" <<Producer>> as Producer #aaeeaa

queue  "test" <<Queue>> as Queue
queue  "amqp_test_exchange" <<Exchange>> as Exchange #aaeeaa 

Producer -> Exchange
Exchange -> Queue
Queue -> Consumer
Consumer -> Middleware

skinparam componentStyle rectangle

package Middleware {
    [JSON.parse]->[Log('Consume)]
    [Log('Consume)]->[Log('Process)] 
}

@enduml

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

### 3. Обробники повідомлень

##### Апгрейд попереднього прикладу, додана здатність фільрувати повідомлення по критеріям: послідовний ланцюжок з middleware дає змогу через Consume Log вивести всі отримані повідомлення в consumerі, але до Process Log доходить лише повідомлення, яке відповідає критерію фільтрування, що закінчується на 5

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
## 4. Валідація повідомлень

##### Додано middleware, яке валідує повідомлення, яке надходить у publisher.

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
##### Додано middleware, яке валідує повідомлення, яке надходить з consumer

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
## 5. Використання метрик

##### Додано middleware, яке на на меті реєстрацію метрик для зборі статистики. В параметри Middlewares.Metric передається об'ект з полем metric для ініціалізації для відповдних потреб і колбек, з такими же аргументами, як і інші в middleware

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

## 6. Використання декількох споживачів на одну чергу

##### Ініціалізація 1 publisher і 2 consumer, які слухають одну й ту саму чергу, і через параметр listenerId повідомлення розподіляються між ними

listener1.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: listen1
    exchange:
        name: broadcast
        mode: fanout
        options:
            durable: false 
    options:
        noAck: true
        
message:
    type: object
    required:
        - id
        - listener
        - timeout
    properties:
        id:
          type: number
        listener:
          type: number
        timeout:
          type: number  


```

listener2.yaml

```yaml

# Worker AMQP settings
amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: listen2
    exchange:
        name: broadcast
        mode: fanout
        options:
            durable: false
    options:
        noAck: true
        
message:
    type: object
    required:
        - id
        - listener
        - timeout
    properties:
        id:
          type: number
        listener:
          type: number
        timeout:
          type: number  


```

producer.yaml

```yaml

# Scheduler AMQP settings
amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: broadcast
    mode: fanout
    options:
        durable: false
        
message:
    type: object
    required:
        - id
        - listener
        - timeout
    properties:
        id:
          type: number
        listener:
          type: number
        timeout:
          type: number  
          

```

```js

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');

const listener1Options = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './listener1.yaml')).toString(),
);
const listener2Options = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './listener2.yaml')).toString(),
);

const producerOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './producer.yaml')).toString(),
);

const run = async () => {
  const producerPipe = [
    Middlewares.Schema.validator(producerOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log('Produce', msg.content);
      next();
    },
  ];

  const listenerPipe = (listenerId) => [
    Middlewares.Json.parse,
    Middlewares.Schema.validator(listener1Options.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Filter(
      (msg) => msg.content && msg.content.listener === listenerId,
    ),

    (err, msg, next) => {
      console.log(
        `Listener ${listenerId} starts ${msg.content.id} : ${msg.content.timeout}`,
      );
      next();
    },

    (err, msg, next) => {
      setTimeout(() => {
        console.log(
          `Listener ${listenerId} complete ${msg.content.id} : ${msg.content.timeout}`,
        );
      }, msg.content.timeout);
    },
  ];

  const producer = await AmqpManager.createPublisher(producerOptions);
  await producer.use(producerPipe);

  const listener1 = await AmqpManager.createConsumer(listener1Options);
  await listener1.use(listenerPipe(1)).start();

  const listener2 = await AmqpManager.createConsumer(listener2Options);
  await listener2.use(listenerPipe(2)).start();

  let listener = 1;

  producer.send({
    id: 0,
    listener,
    timeout: Math.round(Math.random() * 1000) + 4000,
  });

  for (let i = 1; i < 6; i++) {
    listener = listener === 1 ? 2 : 1;
    producer.send({
      id: i,
      listener,
      timeout: Math.round(Math.random() * 1000) + 200,
    });
  }

  setTimeout(async () => {
    await producer.close();
    await listener1.close();
    await listener2.close();
  }, 10000);
};

run();


```

```sh

Produce {"id":0,"listener":1,"timeout":4061}
Produce {"id":1,"listener":2,"timeout":373}
Produce {"id":2,"listener":1,"timeout":863}
Produce {"id":3,"listener":2,"timeout":955}
Produce {"id":4,"listener":1,"timeout":886}
Produce {"id":5,"listener":2,"timeout":876}
Listener 1 starts 0 : 4061
Listener 2 starts 1 : 373
Listener 2 starts 3 : 955
Listener 2 starts 5 : 876
Listener 1 starts 2 : 863
Listener 1 starts 4 : 886
Listener 2 complete 1 : 373
Listener 1 complete 2 : 863
Listener 2 complete 5 : 876
Listener 1 complete 4 : 886
Listener 2 complete 3 : 955
Listener 1 complete 0 : 4061

```

## 7. Використання декількох споживачів(воркерів з ручним підтвердженням отримання повідомленням) на одну чергу

##### Ініціалізація одного publisher і 2 consumer, які слухають одну й ту саму чергу як і в попередньому прикладі. Але, різниця полягає в тому, що в yaml конфігу задано noAck: false. Це означає, що потрібно викликати .ack(). Якщо цього не зробити, слухач "зупиниться" на цьому повідомленні, як і реалізовано: за час 4 сек, другий воркер опрацює всі повідомлення в черзі, а перший воркер буде 'вісіти' на першому повідомленні

scheduler.yaml

```yaml

# Scheduler AMQP settings
amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: test_task
    mode: direct
        
message:
    type: object
    required:
        - id
        - timeout
    properties:
        id:
          type: number
        timeout:
          type: number  
          

```

worker.yaml

```yaml

# Worker AMQP settings
amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: test_task
    exchange:
        name: test_task
        mode: direct
    options:
        prefetch: 1
        noAck: false
        
message:
    type: object
    required:
        - id
        - timeout
    properties:
        id:
          type: number
        timeout:
          type: number  


```

```js

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');

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


```

```sh

Worker 1 fetch task 0, 4073
Worker 2 fetch task 2, 600
Worker 2 process 2 : 600
Worker 2 fetch task 3, 642
Worker 2 process 3 : 642
Worker 2 fetch task 4, 779
Worker 2 process 4 : 779
Worker 2 fetch task 5, 1153
Worker 1 process 0 : 4073
Worker 2 process 5 : 1153

```

## 8. Використання декількох публікувальників в одну чергу

##### Ініціалізація 2 однакових publisher і 1 consumer, який логує всі повідомлення

listener.yaml

```yaml


amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: dataflow
    
    exchange:
        name: concentrator
        mode: fanout

    options:
        noAck: true
        
message:
    type: object
    required:
        - id
        - producer
        - timeout
    properties:
        id:
          type: number
        producer:
          type: number
        timeout:
          type: number  

```

producer.yaml


```yaml


amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: concentrator
    mode: fanout
        
message:
    type: object
    required:
        - id
        - producer
        - timeout
    properties:
        id:
          type: number
        producer:
          type: number
        timeout:
          type: number  
          
```

```js

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');

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

```

```sh

Producer 1 send  {"id":0,"producer":1,"timeout":4534}
Producer 2 send  {"id":0,"producer":2,"timeout":4903}
Producer 1 send  {"id":1,"producer":1,"timeout":515}
Producer 2 send  {"id":1,"producer":2,"timeout":1077}
Producer 1 send  {"id":2,"producer":1,"timeout":1027}
Producer 2 send  {"id":2,"producer":2,"timeout":800}
Producer 1 send  {"id":3,"producer":1,"timeout":430}
Producer 2 send  {"id":3,"producer":2,"timeout":1175}
Producer 1 send  {"id":4,"producer":1,"timeout":537}
Producer 2 send  {"id":4,"producer":2,"timeout":624}
Producer 1 send  {"id":5,"producer":1,"timeout":636}
Producer 2 send  {"id":5,"producer":2,"timeout":530}
Listener starts { id: 0, producer: 1, timeout: 4534 }
Listener starts { id: 1, producer: 1, timeout: 515 }
Listener starts { id: 0, producer: 2, timeout: 4903 }
Listener starts { id: 2, producer: 1, timeout: 1027 }
Listener starts { id: 1, producer: 2, timeout: 1077 }
Listener starts { id: 3, producer: 1, timeout: 430 }
Listener starts { id: 2, producer: 2, timeout: 800 }
Listener starts { id: 4, producer: 1, timeout: 537 }
Listener starts { id: 3, producer: 2, timeout: 1175 }
Listener starts { id: 5, producer: 1, timeout: 636 }
Listener starts { id: 4, producer: 2, timeout: 624 }
Listener starts { id: 5, producer: 2, timeout: 530 }
Listener complete { id: 3, producer: 1, timeout: 430 }
Listener complete { id: 1, producer: 1, timeout: 515 }
Listener complete { id: 5, producer: 2, timeout: 530 }
Listener complete { id: 4, producer: 1, timeout: 537 }
Listener complete { id: 4, producer: 2, timeout: 624 }
Listener complete { id: 5, producer: 1, timeout: 636 }
Listener complete { id: 2, producer: 2, timeout: 800 }
Listener complete { id: 2, producer: 1, timeout: 1027 }
Listener complete { id: 1, producer: 2, timeout: 1077 }
Listener complete { id: 3, producer: 2, timeout: 1175 }
Listener complete { id: 0, producer: 1, timeout: 4534 }
Listener complete { id: 0, producer: 2, timeout: 4903 }

```

## 9. Використання різних пар publisher-consumer, які ланцюгово використовуються.

##### Initiator пара надсилає і отримує повідомлення, і під час останнього тригерить publisher з інших пари, який запускає вже свій процес з надсилання і отрмування повідомлення відповідно cunsumer. Queue та exchange для кожної пари різний.

initiator-listener.yaml

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

initiator-listener.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: initiator
    mode: fanout

```

producer-listener.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: producer
    
    exchange:
        name: producer
        mode: fanout

    options:
        noAck: true

```

producer.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: producer
    mode: fanout

```

```js

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');

const initiatorOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './initiator.yaml')).toString(),
);
const initiatorListenerOptions = yaml2js(
  fs
    .readFileSync(path.resolve(__dirname, './initiator-listener.yaml'))
    .toString(),
);
const producerOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './producer.yaml')).toString(),
);
const producerListenerOptions = yaml2js(
  fs
    .readFileSync(path.resolve(__dirname, './producer-listener.yaml'))
    .toString(),
);
const messageSchema = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './message.yaml')).toString(),
);

const run = async () => {
  const initiator = await AmqpManager.createPublisher(initiatorOptions);
  await initiator.use([
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log('Initiator send ', msg.content);
      next();
    },
  ]);

  const producer = await AmqpManager.createPublisher(producerOptions);
  await producer.use([
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log('Producer send ', msg.content);
      next();
    },
  ]);

  const initiatorListener = await AmqpManager.createConsumer(
    initiatorListenerOptions,
  );
  await initiatorListener
    .use([
      Middlewares.Json.parse,
      Middlewares.Schema.validator(messageSchema),
      Middlewares.Error.Log,
      Middlewares.Error.BreakChain,

      (err, msg, next) => {
        console.log('Initiator listener starts', msg.content);
        next();
      },

      (err, msg, next) => {
        setTimeout(async () => {
          console.log('Initiator listener complete', msg.content);
          msg.content.meta.timestamp = new Date();
          producer.send(msg.content);
        }, msg.content.timeout);
      },
    ])
    .start();

  const producerListener = await AmqpManager.createConsumer(
    producerListenerOptions,
  );
  await producerListener
    .use([
      Middlewares.Json.parse,
      Middlewares.Schema.validator(messageSchema),
      Middlewares.Error.Log,
      Middlewares.Error.BreakChain,

      (err, msg, next) => {
        console.log('Producer listener consume', msg.content);
        next();
      },
    ])
    .start();

  await initiator.send({
    id: 0,
    meta: {},
    timeout: Math.round(Math.random() * 1000) + 4000,
  });

  for (let i = 1; i < 6; i++) {
    initiator.send({
      id: i,
      meta: {},
      timeout: Math.round(Math.random() * 1000) + 200,
    });
  }

  setTimeout(async () => {
    await initiator.close();
    await producer.close();
    await initiatorListener.close();
    await producerListener.close();
  }, 10000);
};

run();

```

```sh

Initiator send  {"id":0,"meta":{},"timeout":4133}
Initiator send  {"id":1,"meta":{},"timeout":678}
Initiator send  {"id":2,"meta":{},"timeout":527}
Initiator send  {"id":3,"meta":{},"timeout":591}
Initiator send  {"id":4,"meta":{},"timeout":1094}
Initiator send  {"id":5,"meta":{},"timeout":470}
Initiator listener starts { id: 0, meta: {}, timeout: 4133 }
Initiator listener starts { id: 1, meta: {}, timeout: 678 }
Initiator listener starts { id: 2, meta: {}, timeout: 527 }
Initiator listener starts { id: 3, meta: {}, timeout: 591 }
Initiator listener starts { id: 4, meta: {}, timeout: 1094 }
Initiator listener starts { id: 5, meta: {}, timeout: 470 }
Initiator listener complete { id: 5, meta: {}, timeout: 470 }
Producer send  {"id":5,"meta":{"timestamp":"2021-11-26T10:05:51.789Z"},"timeout":470}
Initiator listener complete { id: 2, meta: {}, timeout: 527 }
Producer send  {"id":2,"meta":{"timestamp":"2021-11-26T10:05:51.848Z"},"timeout":527}
Initiator listener complete { id: 3, meta: {}, timeout: 591 }
Producer send  {"id":3,"meta":{"timestamp":"2021-11-26T10:05:51.909Z"},"timeout":591}
Producer listener consume {
  id: 5,
  meta: { timestamp: '2021-11-26T10:05:51.789Z' },
  timeout: 470
}
Initiator listener complete { id: 1, meta: {}, timeout: 678 }
Producer send  {"id":1,"meta":{"timestamp":"2021-11-26T10:05:51.997Z"},"timeout":678}
Producer listener consume {
  id: 2,
  meta: { timestamp: '2021-11-26T10:05:51.848Z' },
  timeout: 527
}
Producer listener consume {
  id: 3,
  meta: { timestamp: '2021-11-26T10:05:51.909Z' },
  timeout: 591
}
Producer listener consume {
  id: 1,
  meta: { timestamp: '2021-11-26T10:05:51.997Z' },
  timeout: 678
}
Initiator listener complete { id: 4, meta: {}, timeout: 1094 }
Producer send  {"id":4,"meta":{"timestamp":"2021-11-26T10:05:52.412Z"},"timeout":1094}
Producer listener consume {
  id: 4,
  meta: { timestamp: '2021-11-26T10:05:52.412Z' },
  timeout: 1094
}
Initiator listener complete { id: 0, meta: {}, timeout: 4133 }

Producer send  {"id":0,"meta":{"timestamp":"2021-11-26T10:05:55.330Z"},"timeout":4133}
Producer listener consume {
  id: 0,
  meta: { timestamp: '2021-11-26T10:05:55.330Z' },
  timeout: 4133
}

```
## 10. Часткове оброблення та композиция результатів

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

initiator.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: messages
    mode: fanout

```

partial-listener.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

queue:
    name: messages
    
    exchange:
        name: messages
        mode: fanout

    options:
        noAck: true
    
```

partial-producer.yaml

```yaml

amqp:
    url: amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg

exchange:
    name: composer_input
    mode: fanout

```

partial.js

```js

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('@molfar/amqp-client');

const partialListenerOptions = yaml2js(
  fs
    .readFileSync(path.resolve(__dirname, './partial-listener.yaml'))
    .toString(),
);
const partialProducerOptions = yaml2js(
  fs
    .readFileSync(path.resolve(__dirname, './partial-producer.yaml'))
    .toString(),
);
const messageSchema = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './message.yaml')).toString(),
);

module.exports = async (id) => {
  const producer = await AmqpManager.createPublisher(partialProducerOptions);
  await producer.use([
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
  ]);

  partialListenerOptions.queue.name = `${partialListenerOptions.queue.name}_${id}`;

  const listener = await AmqpManager.createConsumer(partialListenerOptions);
  await listener.use([
    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,

    (err, msg, next) => {
      const delay = Math.round(Math.random() * 1000) + 200;
      setTimeout(async () => {
        msg.content.meta.partial[id] = {
          complete: true,
          timeout: delay,
        };
        producer.send(msg.content);
      }, delay);
    },
  ]);

  return {
    start: async () => {
      await listener.start();
    },
    close: async () => {
      await listener.close();
      await producer.close();
    },
  };
};

```

initiator.js

```js

/* eslint-disable no-unused-vars */

const fs = require('fs');
const path = require('path');
const { AmqpManager, Middlewares, yaml2js, getMetrics } = require('../../lib');

const initiatorOptions = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './initiator.yaml')).toString(),
);
const messageSchema = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './message.yaml')).toString(),
);

module.exports = async () => {
  const initiator = await AmqpManager.createPublisher(initiatorOptions);

  await initiator.use([
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log('Initiator send ', msg.content);
      next();
    },
  ]);

  return initiator;
};

```

composer.js

```js

/* eslint-disable no-unused-vars */

const fs = require('fs');
const path = require('path');
const {
  AmqpManager,
  Middlewares,
  yaml2js,
  deepExtend,
  getMetrics,
} = require('../../lib');

const composerListenerOptions = yaml2js(
  fs
    .readFileSync(path.resolve(__dirname, './composer-listener.yaml'))
    .toString(),
);
const messageSchema = yaml2js(
  fs.readFileSync(path.resolve(__dirname, './message.yaml')).toString(),
);

module.exports = async () => {
  const messageBuffer = {};

  const listener = await AmqpManager.createConsumer(composerListenerOptions);
  await listener.use([
    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,

    (err, msg, next) => {
      if (messageBuffer[msg.content.id]) {
        messageBuffer[msg.content.id].meta = deepExtend(
          messageBuffer[msg.content.id].meta,
          msg.content.meta,
        );
      } else {
        messageBuffer[msg.content.id] = msg.content;
      }

      if (
        messageBuffer[msg.content.id].meta.partial.ner &&
        messageBuffer[msg.content.id].meta.partial.sa
      ) {
        console.log(
          'Composer complete partials',
          JSON.stringify(messageBuffer[msg.content.id], null, ' '),
        );
        delete messageBuffer[msg.content.id];
      }

      next();
    },
  ]);

  return listener;
};

```

index.js

```js

/* eslint-disable no-unused-vars */

const INITIATOR = require('./initiator');
const PARTIAL = require('./partial');
const COMPOSER = require('./composer');

const run = async () => {
  const initiator = await INITIATOR();
  const ner = await PARTIAL('ner');
  const sa = await PARTIAL('sa');
  const composer = await COMPOSER();

  await ner.start();
  await sa.start();
  await composer.start();

  const phrase = 'This is very small workflow';

  phrase.split(' ').forEach(async (word, index) => {
    await initiator.send({
      id: index,
      data: {
        text: word,
      },
      meta: {
        partial: {},
      },
    });
  });

  setTimeout(async () => {
    await initiator.close();
    await ner.close();
    await sa.close();
    await composer.close();
  }, 10000);
};

run();

```

```sh

Initiator send  {"id":0,"data":{"text":"This"},"meta":{"partial":{}}}
Initiator send  {"id":1,"data":{"text":"is"},"meta":{"partial":{}}}
Initiator send  {"id":2,"data":{"text":"very"},"meta":{"partial":{}}}
Initiator send  {"id":3,"data":{"text":"small"},"meta":{"partial":{}}}
Initiator send  {"id":4,"data":{"text":"workflow"},"meta":{"partial":{}}}
Composer complete partials {
 "id": 4,
 "data": {
  "text": "workflow"
 },
 "meta": {
  "partial": {
   "ner": {
    "complete": true,
    "timeout": 246
   },
   "sa": {
    "complete": true,
    "timeout": 418
   }
  }
 }
}
Composer complete partials {
 "id": 3,
 "data": {
  "text": "small"
 },
 "meta": {
  "partial": {
   "ner": {
    "complete": true,
    "timeout": 585
   },
   "sa": {
    "complete": true,
    "timeout": 853
   }
  }
 }
}
Composer complete partials {
 "id": 0,
 "data": {
  "text": "This"
 },
 "meta": {
  "partial": {
   "sa": {
    "complete": true,
    "timeout": 571
   },
   "ner": {
    "complete": true,
    "timeout": 995
   }
  }
 }
}
Composer complete partials {
 "id": 1,
 "data": {
  "text": "is"
 },
 "meta": {
  "partial": {
   "sa": {
    "complete": true,
    "timeout": 721
   },
   "ner": {
    "complete": true,
    "timeout": 1004
   }
  }
 }
}
Composer complete partials {
 "id": 2,
 "data": {
  "text": "very"
 },
 "meta": {
  "partial": {
   "ner": {
    "complete": true,
    "timeout": 566
   },
   "sa": {
    "complete": true,
    "timeout": 1192
   }
  }
 }
}

```