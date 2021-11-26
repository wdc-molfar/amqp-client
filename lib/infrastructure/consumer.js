const Middleware = require('../middlewares/wrapper');

/**
 * Клас для створення Consumer
 */
class Consumer {

  #manager
  #connection;
  #client;
  #options;
  #channel;
  #queue;
  #middleware;

  /**
   * @param manager
   * @param connection - конфігурації з'єднання
   * @param client - інформація  про клієнта
   * @param options - опції Consumer
   */
  constructor(manager, connection, client, options) {
    this.#manager = manager;
    this.#connection = connection;
    this.#client = client;
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

/**
 * Ініціалізація Consumer-залежностей
 */
  async moduleInit() {
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
  
    await this.#channel.bindQueue(
      this.#queue,
      this.#options.queue.exchange.name,
      '',
    );
    this.#middleware = new Middleware();
  }

  /**
   * Зберігає callback в middleware для Consumer
   * @param callback
   */
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
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * Закриття каналу на з'єднання
   * @param callback
   */
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
