const validate = require("./schemas").consumer.validate
const defaultOptions = require("./defaults").consumer
const { extend } = require("lodash")
const { deepExtend, getConnection, closeConnection, Middleware } = require("./util")

const Consumer = class {

    constructor(options) {


        return (async () => {
            // All async code here
            options = options || {}
            this.options = deepExtend(deepExtend({}, defaultOptions), options)
            if (!validate(this.options)) {
                throw new Error(validate.errors.map(e => `Cannot create Consumer. On "${e.instancePath}": ${e.message}`).join("\n"))
            }
            let connection = await getConnection(this, this.options.amqp)
            this.channel = await connection.createChannel()
            this.exchange = await this.channel.assertExchange(
                this.options.queue.exchange.name,
                this.options.queue.exchange.mode,
                this.options.queue.exchange.options
            )

            let assertion = await this.channel.assertQueue(
                this.options.queue.name || '',
                this.options.queue.options
            )

            this.queue = assertion.queue

            await this.channel.bindQueue(this.queue, this.options.queue.exchange.name, '');

            this.middleware = new Middleware()
            return this; // when done
        })();

    }

    use(callback) {
        this.middleware.use(callback)
        return this
    }

    async start() {
        try {
            await this.channel.consume(this.queue, async msg => {
                msg.ack = () => this.channel.ack(msg)
                msg.nack = () => this.channel.nack(msg)
                try {
                    await this.middleware.execute(msg)
                } catch (e) {
                    throw e
                }
            })
        } catch (e) {
            throw e
        }
    }

    async close() {
        await this.channel.close()
        await closeConnection(this)
    }

}


module.exports = Consumer