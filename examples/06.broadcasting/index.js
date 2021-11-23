/* eslint-disable no-unused-vars */

const { 
  AmqpManager, 
  Middlewares, 
  yaml2js,
  getMetrics
} = require('../../lib');

const fs = require("fs")
const path = require("path")


const listener1_Options = yaml2js( fs.readFileSync(path.resolve(__dirname, "./listener1.yaml")).toString() )
const listener2_Options = yaml2js( fs.readFileSync(path.resolve(__dirname, "./listener2.yaml")).toString() )

const producerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./producer.yaml")).toString() )

const run = async () => {

  const producerPipe = [
    Middlewares.Schema.validator(producerOptions.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log("Produce", msg.content)
      next()
    }
  ]


  const listenerPipe = listenerId => [
    Middlewares.Json.parse,
    Middlewares.Schema.validator(listener1_Options.message),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Filter(
      msg => msg.content && msg.content.listener == listenerId
    ),
    
    (err, msg, next) => {
      console.log(`Listener ${listenerId} starts ${msg.content.id} : ${msg.content.timeout}`)
      next()
    },

    (err, msg, next) => {
      setTimeout( () => {
        console.log(`Listener ${listenerId} complete ${msg.content.id} : ${msg.content.timeout}`)
      }, msg.content.timeout)
    }

  ]


  const producer = await AmqpManager.createPublisher(producerOptions)
  await producer.use(producerPipe)


  const listener1 = await AmqpManager.createConsumer(listener1_Options)
  await listener1.use(listenerPipe(1)).start()

  const listener2 = await AmqpManager.createConsumer(listener2_Options)
  await listener2.use(listenerPipe(2)).start()

  let listener = 1
  
  producer.send({
    id:0,
    listener,
    timeout: Math.round(Math.random()*1000)+4000
  })

  for(let i=1; i< 6; i++){
    listener = (listener == 1) ? 2 : 1
    producer.send({
      id:i,
      listener,
      timeout: Math.round(Math.random()*1000)+200
    })
  }

  setTimeout(async () => {
    await producer.close()
    await listener1.close()
    await listener2.close()
  }, 10000);
};

run();
