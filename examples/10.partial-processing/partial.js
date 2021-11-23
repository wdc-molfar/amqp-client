/* eslint-disable no-unused-vars */

const { 
  AmqpManager, 
  Middlewares, 
  yaml2js,
  getMetrics
} = require('../../lib');

const fs = require("fs")
const path = require("path")

const partialListenerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./partial-listener.yaml")).toString() )
const partialProducerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./partial-producer.yaml")).toString() )
const messageSchema = yaml2js( fs.readFileSync(path.resolve(__dirname, "./message.yaml")).toString() ) 

module.exports = async (id) => {
  
  let producer = await AmqpManager.createPublisher(partialProducerOptions)
  await producer.use([
    
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    Middlewares.Json.stringify

  ])

  partialListenerOptions.queue.name = partialListenerOptions.queue.name+"_"+id

  let listener = await AmqpManager.createConsumer(partialListenerOptions)
  await listener.use([
    
    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    
    (err, msg, next) => {
      const delay = Math.round(Math.random()*1000)+200
      setTimeout( async () => {
        msg.content.meta.partial[id] = {
          complete: true,
          timeout: delay
        }  
        producer.send(msg.content)
      
      }, delay)
    }

  ])

  return {
      start: async () => { await listener.start() },
      close: async () => {
        await listener.close()
        await producer.close()
      }
  }  

}


