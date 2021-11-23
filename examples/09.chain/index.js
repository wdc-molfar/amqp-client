/* eslint-disable no-unused-vars */

const { 
  AmqpManager, 
  Middlewares, 
  yaml2js,
  getMetrics
} = require('../../lib');

const fs = require("fs")
const path = require("path")

const initiatorOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./initiator.yaml")).toString() )
const initiatorListenerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./initiator-listener.yaml")).toString() )
const producerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./producer.yaml")).toString() )
const producerListenerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./producer-listener.yaml")).toString() )
const messageSchema = yaml2js( fs.readFileSync(path.resolve(__dirname, "./message.yaml")).toString() ) 

const run = async () => {

  let initiator = await AmqpManager.createPublisher(initiatorOptions)
  await initiator.use([
    
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log(`Initiator send `, msg.content)
      next()
    }

  ])
  

  let producer = await AmqpManager.createPublisher(producerOptions)
  await producer.use([
    
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify,
    (err, msg, next) => {
      console.log(`Producer send `, msg.content)
      next()
    }

  ])


  const initiatorListener = await AmqpManager.createConsumer(initiatorListenerOptions)
  await initiatorListener.use([
    
    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    
    (err, msg, next) => {
      console.log(`Initiator listener starts`, msg.content)
      next()
    },

    (err, msg, next) => {
      setTimeout( async () => {
         console.log(`Initiator listener complete`, msg.content)
         msg.content.meta.timestamp = new Date()
         producer.send(msg.content)
      }, msg.content.timeout)
    }

  ]).start()
  
  
  
  
  const producerListener = await AmqpManager.createConsumer(producerListenerOptions)
  await producerListener.use([

    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    
    (err, msg, next) => {
      console.log(`Producer listener consume`, msg.content)
      next()
    }

  ]).start()
  



  
  await initiator.send({
    id:0,
    meta: {},
    timeout: Math.round(Math.random()*1000)+4000
  })
  
  

  for(let i=1; i< 6; i++){
    initiator.send({
      id:i,
      meta: {},
      timeout: Math.round(Math.random()*1000)+200
    })

  }

  setTimeout(async () => {
    await initiator.close()
    await producer.close()
    await initiatorListener.close()
    await producerListener.close()
  }, 10000);

};

run();
