const Middleware = require('../middlewares/wrapper');
const { v4 } = require('uuid');
class Consumer {
  #manager
  #connection;
  #client;
  #options;
  #channel;
  #queue;
  #middleware;

  constructor(manager, options) {
    this.#manager = manager;
    this.#client = v4();
    this.#options = options;
  }

  get connection() {
    return this.#connection;
  }

  get client() {
    return this.#client;
  }

  get options() {
    return this.#options;
  }

  get channel() {
    return this.#channel;
  }

  get queue() {
    return this.#queue;
  }

  get middleware() {
    return this.#middleware;
  }

  async moduleInit() {
    this.#connection = await this.#manager.getConnection(this.#client, this.#options.amqp);
    this.#channel = await this.#connection.createChannel();
    await this.#channel.assertExchange(
      this.#options.queue.exchange.name,
      this.#options.queue.exchange.mode,
      this.#options.queue.exchange.options,
    );
    const assertion = await this.#channel.assertQueue(
      this.#options.queue.name,
      this.#options.queue.options,
    );

    this.#queue = assertion.queue;
    
    if(!Number.isNaN(Number.parseInt(this.#options.queue.options.prefetch))) this.#channel.prefetch(this.#options.queue.options.prefetch)
    
    await this.#channel.bindQueue(
      this.#queue,
      this.#options.queue.exchange.name,
      '',
    );
    this.#middleware = new Middleware();
  }
  
  use(callback) {
    this.#middleware.use(callback);
    return this;
  }

  async start() {
    try {
      await this.#channel.consume(
        this.#queue,
        async (msg) => {
          const ack = () => this.#channel.ack(msg);
          const nack = () => this.#channel.nack(msg);
          try {
            await this.#middleware.execute({ content: msg.content, ack, nack });
          } catch (e) {
            throw e;
          }
        },
        this.#options.queue.options
      );
    } catch (err) {
      throw err;
    }
  }

  async close(callback) {
    await this.#channel.close();
    if( callback) {
      await callback(this.#client);  
    } else {
      this.#manager.closeConnection(this.#client)
    }
  }
}

module.exports = Consumer;
