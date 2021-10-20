const validate = require("./schemas").publisher.validate
const defaultOptions = require("./defaults").publisher
const { deepExtend } = require("./util")
const ConnectionPool = require("./connection-pool")

const Publisher = class {

	constructor(options){
		
		options = options || {}
		this.options = deepExtend(deepExtend( {}, defaultOptions), options)
		if (!validate(this.options)){
			throw new Error(validate.errors.map(e => `Cannot create Publisher. On "${e.instancePath}": ${e.message}`).join("\n"))
		}
		return (async () => {
		    // All async code here
		    this.conn = await ConnectionPool.getConnection(this.options.amqp)
		    this.channel = await this.conn.connection.createChannel()
		    this.exchange = await this.channel.assertExchange(
		    	this.options.exchange.name,
		    	this.options.exchange.mode,
		    	this.options.exchange.options
		    )
		    
		    return this; // when done
        })();

	}

	async send(msg){
		await this.channel.publish(this.options.exchange.name, '', Buffer.from(JSON.stringify(msg)));
	}
	
	async close(){
		// await this.channel.close()
		await ConnectionPool.closeConnection(this.conn.connectionId)
	}

}


module.exports = Publisher
