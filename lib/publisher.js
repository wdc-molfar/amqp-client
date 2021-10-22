const validate = require("./schemas").publisher.validate
const defaultOptions = require("./defaults").publisher
const { deepExtend, getConnection, closeConnection, Middleware, createMessage } = require("./util")

const Publisher = class {

    constructor(options) {

        options = options || {}
        this.options = deepExtend(deepExtend({}, defaultOptions), options)
        if (!validate(this.options)) {
            throw new Error(validate.errors.map(e => `Cannot create Publisher. On "${e.instancePath}": ${e.message}`).join("\n"))
        }
        return (async () => {
            // All async code here
            let connection = await getConnection(this, this.options.amqp)
            this.channel = await connection.createChannel()
            this.exchange = await this.channel.assertExchange(
                this.options.exchange.name,
                this.options.exchange.mode,
                this.options.exchange.options
            )

            this.middleware = new Middleware(async (err, msg, next) => {
                if (err) throw err
                await this.channel.publish(this.options.exchange.name, '', Buffer.from(msg.content))
                next()
            })

            return this; // when done
        })();

    }

    use(callback) {
        this.middleware.use(callback)
        return this
    }

    async send(msg) {
        msg = createMessage(msg)
        try {
            await this.middleware.execute(msg)
        } catch (e) {
            throw e
        }
    }

    async close() {
        await this.channel.close()
        await closeConnection(this)
    }

}


module.exports = Publisher