const Middleware = require('../middlewares/wrapper');

class Publisher {
  #manager
  #connection;
  #client;
  #options;
  #channel;
  #middleware;

  /**
   * @param manager
   * @param connection
   * @param client - інформація  про клієнта
   * @param options - опції Consumer
   * */
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

  get middleware() {
    return this.#middleware;
  }

  /**
   * Ініціалізація Publisher-залежностей
   */
  async moduleInit() {
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
  
  /**
   * Зберігає callback в middleware для Publisher
   * @param callback
   * */
  use(callback) {
    this.#middleware.use(callback);
    return this;
  }

  /**
   * Відправлення повідомлення
   * @param msg
   */
  async send(msg) {
    try {
      await this.#middleware.execute({ content: msg });
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

module.exports = Publisher;
