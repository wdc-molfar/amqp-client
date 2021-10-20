const amqp = require("amqplib")
const validate = require("./schemas").connection.validate


let poll = {}

const getConnection = async options => {
	if(!validate(options)) {
		throw new Error(validate.errors.map(e => `Cannot create connection. On ".${e.instancePath}": ${e.message}`).join("\n"))
	}

	poll[options.url] = poll[options.url] || await amqp.connect(options.url)

	return {
		connectionId: options.url,
		connection: poll[options.url]
	}	
} 


const closeConnection = async connectionId => {
	if (poll[connectionId]) {
		await poll[connectionId].close()
		delete poll[connectionId]
	}
} 


module.exports = {
	getConnection,
	closeConnection
}
