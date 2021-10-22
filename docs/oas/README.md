# Розроблення модуля

## Приклади використання

### Завантаження залежності

```sh
    npm install --save wdc-molfar
```

### Базовий приклад

```js

const { Consumer, Publisher } = require("@molfar/amqp-client")

const amqp = {
        url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
    }

const exchange = {
    name: "amqp_test_exchange"
}


const consumerOptions = {
    amqp,
    queue:{
        exchange
    }
}

const publisherOptions = {
    amqp,
    exchange
}


let run  = async () => {

    
    let consumer = await new Consumer(consumerOptions)
    
    await consumer
            .use( ( err, msg, next) => {
                console.log("Consume: ", msg.content)
                msg.ack()
                next()
            })
            .start()
    

    let publisher = await new Publisher(publisherOptions)
    
    publisher
        .use(( err, msg, next) => {
            msg.content = JSON.stringify(msg.content)
            next()
        })

    for(let i=1; i<=5; i++){
        await publisher.send({
            data:`test message ${i}`
        })  
    }
    await publisher.send("hello")   
    await publisher.send({data:10}) 

    setTimeout(async () => {
        await publisher.close()
        await consumer.close()
    }, 1000)
    
}

run()
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
const { Consumer, Publisher } = require("@molfar/amqp-client")

const amqp = {
        url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
    }

const exchange = {
    name: "amqp_test_exchange"
}


const consumerOptions = {
    amqp,
    queue:{
        exchange
    }
}

const publisherOptions = {
    amqp,
    exchange
}


let run  = async () => {

    
    let consumer = await new Consumer(consumerOptions)
    
    await consumer
            .use( ( err, msg, next) => {
                msg.content = JSON.parse(msg.content)
                next()
            })
            .use( ( err, msg, next) => {
                console.log("Consume: ", msg.content)
                msg.ack()
                next()
            })
            .use( async ( err, msg, next) => {
                console.log("Process:", msg.content)
                next()
            })
            .start()
    

    let publisher = await new Publisher(publisherOptions)
    
    publisher
        .use(( err, msg, next) => {
            msg.content = JSON.stringify(msg.content)
            next()
        })

    for(let i=1; i<=5; i++){
        await publisher.send({
            data:`test message ${i}`
        })  
    }
    await publisher.send("hello")   
    await publisher.send({data:10}) 

    setTimeout(async () => {
        await publisher.close()
        await consumer.close()
    }, 1000)
    
}

run()
```

```sh

Consume:  { data: 'test message 1' }                                                                                                                     
Process: { data: 'test message 1' }                                                                                                                      
Consume:  { data: 'test message 2' }                                                                                                                     
Consume:  { data: 'test message 3' }                                                                                                                     
Consume:  { data: 'test message 4' }                                                                                                                     
Consume:  { data: 'test message 5' }                                                                                                                     
Consume:  hello                                                                                                                                          
Consume:  { data: 10 }                                                                                                                                   
Process: { data: 'test message 2' }                                                                                                                      
Process: { data: 'test message 3' }                                                                                                                      
Process: { data: 'test message 4' }                                                                                                                      
Process: { data: 'test message 5' }                                                                                                                      
Process: hello                                                                                                                                           
Process: { data: 10 }       

```

### Стандартні обробники повідомлень

```js 

const { Consumer, Publisher, Middleware} = require("@molfar/amqp-client")

const amqp = {
        url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
    }

    const exchange = {
        name: "amqp_test_exchange"
    }


    const consumerOptions = {
        amqp,
        queue:{
            exchange
        }
    }

    const publisherOptions = {
        amqp,
        exchange
    }


let run  = async () => {

    
    let consumer = await new Consumer(consumerOptions)
    
    await consumer
            .use( Middleware.Json.parse )
                        
            .use( ( err, msg, next) => {
                console.log("Consume: ", msg.content)
                msg.ack()
                next()
            })

            .use( Middleware.Filter( msg => {
                return msg.content && msg.content.data.endsWith("5")
            }))
            
            .use( ( err, msg, next) => {
                console.log("Process:", msg.content)
            })
            
            .start()
    

    let publisher = await new Publisher(publisherOptions)
    publisher
        
        .use (( err, msg, next) => {
            console.log("Send:", msg.content)
            next()
        })
                        
        .use(Middleware.Json.stringify)


    for(let i=1; i<=5; i++){
        await publisher.send({
            data:`test message ${i}`
        })  
    }
    
    await publisher.send("hello")   
    await publisher.send({data:10}) 
    

    setTimeout(async () => {
        await publisher.close()
        await consumer.close()
    }, 1000)
    
}

run()


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
Consume:  hello                                                                                                                                          
Consume:  { data: 10 }                                                                                                                                   
Process: hello                                                                                                                                           
Process: { data: 10 }                                                                                                                                    
Process: { data: 'test message 5' }       

```


## Валідація повідомлень

На стороні публікувальника:

```js
const { Consumer, Publisher, Middleware, yaml2js } = require("@molfar/amqp-client")

const amqp = {
        url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
    }

    const exchange = {
        name: "amqp_test_exchange"
    }


    const consumerOptions = {
        amqp,
        queue:{
            exchange
        }
    }

    const publisherOptions = {
        amqp,
        exchange
    }


const schema = {
    type: "object",
    required: ["data"],
    properties:{
        data: {
            type: "string"
        }
    },
    errorMessage:{
        type: "The sended message should be a object",
        properties:{
            data: "The sended message data should be a string"
        }
    }
}


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

`)


let run  = async () => {

    
    let consumer = await new Consumer(consumerOptions)
    
    await consumer
            .use( Middleware.Json.parse )
            
            
            .use( ( err, msg, next) => {
                console.log("Consume: ", msg.content)
                msg.ack()
                next()
            })

            .use( 
                [ 
                    // Middleware.Schema.validator(inputSchema),
                    // Middleware.Error.Log,
                    // Middleware.Error.BreakChain,
                    Middleware.Filter( msg => {
                        return msg.content && msg.content.data.endsWith("5")
                    }),
                ]   
            )
            
            .use( async ( err, msg, next) => {
                console.log("Process:", msg.content)
            })
            
            .start()
    

    let publisher = await new Publisher(publisherOptions)
    publisher
        
        .use( [ Middleware.Schema.validator(schema), 
                Middleware.Error.Log, 
                Middleware.Error.BreakChain 
        ])

        .use (( err, msg, next) => {
            console.log("Send:", msg.content)
            next()
        })
                        
        .use(Middleware.Json.stringify)


    for(let i=1; i<=5; i++){
        await publisher.send({
            data:`test message ${i}`
        })  
    }
    
    await publisher.send("hello")   
    await publisher.send({data:10}) 
    

    setTimeout(async () => {
        await publisher.close()
        await consumer.close()
    }, 1000)
    
}

run()


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
    at Array.<anonymous> (D:\MOLFAR\1\amqp-client\lib\middlewares\schema.js:12:10)                                                                       
    at Middleware.execute (D:\MOLFAR\1\amqp-client\lib\util.js:150:90)                                                                                   
    at Publisher.send (D:\MOLFAR\1\amqp-client\lib\publisher.js:43:35)                                                                                   
    at run (D:\MOLFAR\1\amqp-client\e1.js:113:18)                                                                                                        
    at processTicksAndRejections (internal/process/task_queues.js:93:5)                                                                                  
Error: Bad message format.                                                                                                                               
{"data":10}                                                                                                                                              
On the path "/data": The sended message data should be a string                                                                                          
    at Array.<anonymous> (D:\MOLFAR\1\amqp-client\lib\middlewares\schema.js:12:10)                                                                       
    at Middleware.execute (D:\MOLFAR\1\amqp-client\lib\util.js:150:90)                                                                                   
    at Publisher.send (D:\MOLFAR\1\amqp-client\lib\publisher.js:43:35)                                                                                   
    at run (D:\MOLFAR\1\amqp-client\e1.js:114:18)                                                                                                        
    at processTicksAndRejections (internal/process/task_queues.js:93:5)                                                                                  
Consume:  { data: 'test message 1' }                                                                                                                     
Consume:  { data: 'test message 2' }                                                                                                                     
Consume:  { data: 'test message 3' }                                                                                                                     
Consume:  { data: 'test message 4' }                                                                                                                     
Consume:  { data: 'test message 5' }                                                                                                                     
Process: { data: 'test message 5' }         

```

На стороні споживача: 

```js

const { Consumer, Publisher, Middleware, yaml2js } = require("@molfar/amqp-client")

const amqp = {
        url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
    }

    const exchange = {
        name: "amqp_test_exchange"
    }


    const consumerOptions = {
        amqp,
        queue:{
            exchange
        }
    }

    const publisherOptions = {
        amqp,
        exchange
    }


const schema = {
    type: "object",
    required: ["data"],
    properties:{
        data: {
            type: "string"
        }
    },
    errorMessage:{
        type: "The sended message should be a object",
        properties:{
            data: "The sended message data should be a string"
        }
    }
}


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

`)


let run  = async () => {

    
    let consumer = await new Consumer(consumerOptions)
    
    await consumer
            .use( Middleware.Json.parse )
            
            
            .use( ( err, msg, next) => {
                console.log("Consume: ", msg.content)
                msg.ack()
                next()
            })

            .use( 
                [ 
                    Middleware.Schema.validator(inputSchema),
                    Middleware.Error.Log,
                    Middleware.Error.BreakChain,
                    Middleware.Filter( msg => {
                        return msg.content && msg.content.data.endsWith("5")
                    }),
                ]   
            )
            
            .use( async ( err, msg, next) => {
                console.log("Process:", msg.content)
            })
            
            .start()
    

    let publisher = await new Publisher(publisherOptions)
    publisher
        
        // .use( [ Middleware.Schema.validator(schema), Middleware.Error.Log, Middleware.Error.BreakChain ] )

        .use (( err, msg, next) => {
            console.log("Send:", msg.content)
            next()
        })
                        
        .use(Middleware.Json.stringify)


    for(let i=1; i<=5; i++){
        await publisher.send({
            data:`test message ${i}`
        })  
    }
    
    await publisher.send("hello")   
    await publisher.send({data:10}) 
    

    setTimeout(async () => {
        await publisher.close()
        await consumer.close()
    }, 1000)
    
}

run()


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
Consume:  hello                                                                                                                                          
Consume:  { data: 10 }                                                                                                                                   
Error: Bad message format.                                                                                                                               
"hello"                                                                                                                                                  
On the path "#": The consumed message should be a object                                                                                                 
    at Array.<anonymous> (D:\MOLFAR\1\amqp-client\lib\middlewares\schema.js:12:10)                                                                       
    at Middleware.execute (D:\MOLFAR\1\amqp-client\lib\util.js:150:90)                                                                                   
    at processTicksAndRejections (internal/process/task_queues.js:93:5)                                                                                  
    at async D:\MOLFAR\1\amqp-client\lib\consumer.js:52:21                                                                                               
Error: Bad message format.                                                                                                                               
{"data":10}                                                                                                                                              
On the path "/data": The consumed message data should be a string                                                                                        
    at Array.<anonymous> (D:\MOLFAR\1\amqp-client\lib\middlewares\schema.js:12:10)                                                                       
    at Middleware.execute (D:\MOLFAR\1\amqp-client\lib\util.js:150:90)                                                                                   
    at processTicksAndRejections (internal/process/task_queues.js:93:5)                                                                                  
    at async D:\MOLFAR\1\amqp-client\lib\consumer.js:52:21                                                                                               
Process: { data: 'test message 5' }   

```
