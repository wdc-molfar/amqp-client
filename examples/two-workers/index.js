/* eslint-disable no-unused-vars */

const { 
  AmqpManager, 
  Middlewares, 
  yaml2js,
  getMetrics
} = require('../../lib');


const amqp = {
  url: 'amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg?heartbeat=60',
};

const exchange = yaml2js(
`
  name: "test_task"
  mode: direct
`
)

const consumerOptions = {
  amqp,
  queue: {
    name: "tasks",
    exchange,
    options:{
      prefetch: 1,
      noAck: false
    }
  },
};

const publisherOptions = {
  amqp,
  exchange,
};


const schema = yaml2js(`
  type: object
  required:
    - id
    - timeout
  properties:
    id:
      type: number
    timeout:
      type: number  
 `);

const run = async () => {

  const schedullerPipe = [
    Middlewares.Schema.validator(schema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify
  ]


  const workerPipe = workerId => [
    Middlewares.Json.parse,
    
    (err, msg, next)=> {
      console.log(`Worker ${workerId} fetch task ${msg.content.id}, ${msg.content.timeout}`)
      next()
    },
    
    Middlewares.Schema.validator(schema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    
    (err, msg, next) => {
      setTimeout( () => {
        console.log(`Worker ${workerId} process ${msg.content.id} : ${msg.content.timeout}`)
        msg.ack()
      }, msg.content.timeout)
    }

  ]


  const scheduler = await AmqpManager.createPublisher(publisherOptions)
  await scheduler.use(schedullerPipe)


  const worker1 = await AmqpManager.createConsumer(consumerOptions)
  await worker1.use(workerPipe(1)).start()

  const worker2 = await AmqpManager.createConsumer(consumerOptions)
  await worker2.use(workerPipe(2)).start()

  scheduler.send({
    id:0,
    timeout: Math.round(Math.random()*1000)+4000
  })

  for(let i=1; i< 6; i++){
    scheduler.send({
      id:i,
      timeout: Math.round(Math.random()*1000)+200
    })
  }

  setTimeout(async () => {
    await scheduler.close()
    await worker1.close()
    await worker2.close()
  }, 10000);
};

run();
