/* eslint-disable no-unused-vars */

const { 
  AmqpManager, 
  Middlewares, 
  yaml2js,
  deepExtend,
  getMetrics
} = require('../../lib');

const fs = require("fs")
const path = require("path")

const composerListenerOptions = yaml2js( fs.readFileSync(path.resolve(__dirname, "./composer-listener.yaml")).toString() )
const messageSchema = yaml2js( fs.readFileSync(path.resolve(__dirname, "./message.yaml")).toString() ) 

module.exports = async () => {
  
  const messageBuffer = {}

  const listener = await AmqpManager.createConsumer(composerListenerOptions)
  await listener.use([

    Middlewares.Json.parse,
    Middlewares.Schema.validator(messageSchema),
    Middlewares.Error.Log,
    Middlewares.Error.BreakChain,
    
    (err, msg, next) => {
      if(messageBuffer[msg.content.id]){
        messageBuffer[msg.content.id].meta = deepExtend(messageBuffer[msg.content.id].meta, msg.content.meta)
      } else {
        messageBuffer[msg.content.id] = msg.content
      }

      if(messageBuffer[msg.content.id].meta.partial.ner && messageBuffer[msg.content.id].meta.partial.sa){
        console.log("Composer complete partials", JSON.stringify(messageBuffer[msg.content.id], null, " "))
        delete messageBuffer[msg.content.id]
      }

      next()
    }


  ])

  return listener
}

