const { Consumer, Publisher } = require("./lib")


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

	
	let c = await new Consumer(consumerOptions)
	c
		.use( async msg => {
			msg.content = JSON.parse(msg.content.toString())	
		})
		.use( async msg => {
			console.log("consume", msg.content)
			msg.ack()
		})
		.start()


	let p = await new Publisher(publisherOptions)

	for(let i=1; i<=5; i++){
		p.send({
			data:`test message ${i}`
		})	
	}
		

	setTimeout(async () => {
		await p.close()
		await c.close()
	}, 1000)
	
}

run()
