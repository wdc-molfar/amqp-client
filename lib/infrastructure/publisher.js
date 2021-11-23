const Middleware = require('../middlewares/wrapper');
const { v4 } = require('uuid');
class Publisher {
  #manager
  #connection;
  #client;
  #options;
  #channel;
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

  get middleware() {
    return this.#middleware;
  }

  async moduleInit() {
    this.#connection = await this.#manager.getConnection(this.#client, this.#options.amqp);
    this.#channel = await this.#connection.createChannel();
    await this.#channel.assertExchange(
      this.#options.exchange.name,
      this.#options.exchange.mode,
      this.#options.exchange.options,
    );
    this.#middleware = new Middleware(async (err, msg, next) => {
      if (err) throw err;
      await this.#channel.publish(
        this.#options.exchange.name,
        '',
        Buffer.from(msg.content),
      );
      next();
    });
  }

  use(callback) {
    this.#middleware.use(callback);
    return this;
  }

  async send(msg) {
    try {
      await this.#middleware.execute({ content: msg });
    } catch (err) {
      throw err;
    }
  }

  async close() {
    await this.#channel.close();
    this.#manager.closeConnection(this.#client);
  }
}

module.exports = Publisher;
