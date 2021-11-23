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
const messageSchema = yaml2js( fs.readFileSync(path.resolve(__dirname, "./message.yaml")).toString() ) 


module.exports = async () => {
  
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
  
  return initiator  
    
} 

