/* eslint-disable no-unused-vars */

const INITIATOR = require("./initiator")
const PARTIAL = require("./partial")
const COMPOSER = require("./composer")

const run = async () => {

  const initiator = await INITIATOR()
  const ner = await PARTIAL("ner")
  const sa = await PARTIAL("sa")
  const composer = await COMPOSER()
  
  await ner.start()
  await sa.start()
  await composer.start()
  

  const phrase = "This is very small workflow"

  phrase.split(" ").forEach( async (word, index) => {
    await initiator.send({
      id: index,
      data:{
        text: word
      },
      meta: {
        partial: {}
      }
    })
    
  })

  setTimeout(async () => {
    await initiator.close()
    await ner.close()
    await sa.close()
    await composer.close()
  }, 10000);

};

run();
