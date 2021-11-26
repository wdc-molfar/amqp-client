
/**
 * @module Publisher
 */

const Middleware = require('../middlewares/wrapper');
const { v4 } = require('uuid');

/**
 * Publisher
 */

class Publisher {
  /**
   * посилання на amqp-manager
   * {@link  ???} AmqpManager*/
  #manager

  /**
   * @property {URL} connection - посилання на з'єднання з amqp
   */
  #connection;

  /**
   * @property {Object} client - UUID клієнта генерується під час створення екземпляра класу
   */
  #client;

  /**
   * @property {Object} options - налаштування Публікувальника повідомлень
   */
  #options;

  /**
   * @property {Object} channel - посилання на екземпляр каналу
   */
  #channel;

  /**
   * @property {URL} middleware - посилання на ланцюжок оброблення повыдомлень
   * {@link use}
   * {@link execute} (../middlewares/wrapper.js)
   */
  #middleware;

/**
 * створює екземпляр публікувальника
 * @param manager - примірник amqp-manager {@link ???}(./amqp-manager.js)
 * @param options - налаштування Публікувальника {@link options}
 * @property client - {@see client}
 * */
  constructor(manager, options) {
    this.#manager = manager;
    this.#client = v4();
    this.#options = options;
  }

  /** гетер для з'єднання
   * @returns {Object} - {@see connection}
   * */
  get connection() {
    return this.#connection;
  }

  /**
   * гетер для клієнта
   * @returns {Object} - {@see client}
   */
  get client() {
    return this.#client;
  }

  /**
   * гетер для клієнта
   * @returns {Object} - {@see client}
   */
  get options() {
    return this.#options;
  }

  /**
   * гетер для клієнта
   * @returns {Object} - {@see client}
   */
  get channel() {
    return this.#channel;
  }

  /**
   * гетер для клієнта
   * @returns {Object} - {@see client}
   */
  get middleware() {
    return this.#middleware;
  }
  /**
   * Ініціалізація Publisher-залежностей
   */
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
  /**
   * Додає callback до ланцюжка оброблення повідомлень @link (#middleware)
   * @param callback
   * */
  use(callback) {
    this.#middleware.use(callback);
    return this;
  }
  /**
   * Відправлення повідомлення при цьому виконує ланцюжок оброблення повідомлення повідомлення {@link #middleware}
   * @param msg - повідомлення
   */
  async send(msg) {
    try {
      await this.#middleware.execute({ content: msg });
    } catch (err) {
      throw err;
    }
  }

  /**
   * Закриває канал по клієнту
   */
  async close() {
    await this.#channel.close();
    this.#manager.closeConnection(this.#client);
  }
}

module.exports = Publisher;
