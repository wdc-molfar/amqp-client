const { Consumer, Publisher, Middleware, yaml2js } = require("./lib")

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