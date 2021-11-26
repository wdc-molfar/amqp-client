/**
 * @module AmqpManager
 */


const amqplib = require('amqplib');
const deepClone = require('../utils/deepClone');
const PublisherValidate = require('../validation/publisher');
const ConsumerValidate = require('../validation/consumer');
const ExplorerValidate = require('../validation/manager');
const Publisher = require('./publisher');
const Consumer = require('./consumer');
const msapi = require('@molfar/msapi-schemas');

const defaultPublisherOptions = msapi.produceStrict.snippet.json;
const defaultConsumerOptions =  msapi.consumeStrict.snippet.json;

/**
 * AmqpManager
 */

class AmqpManager {
  /**
   * @type {Object} - посилання на amqp-manager
   */
  static #instance;

  /**
   * @type {Map} - колекція ключ/значення
   */
  #pool = new Map();

  constructor() {}

  /**
   * Створює посилання на amqp-manager якщо його немає
   * @returns {Object} - {@see instance}
   * @alias module: AmqpManager
   */
  static getInstance() {
    if (!AmqpManager.#instance) {
      AmqpManager.#instance = new AmqpManager();
    }
    return AmqpManager.#instance;
  }

  /**
   * Створює нове посилання на amqp-manager
   * @returns {Object}
   */
  newInstance() {
    AmqpManager.#instance = null;
    return AmqpManager.getInstance();
  }

  /**
   * гетер для колекції
   * @returns {Map}
   */
  get pool() {
    return this.#pool;
  }

  /**
   * Задає значення для колекції
   * @param newPool нова колекція
   */
  set pool(newPool) {
    this.#pool = newPool;
  }

  /**
   * @returns {Map} повертає конфігурацію з'єднання
   * @param url url для з'єднання з AMQP-брокером
   */
  getConnectionConfig(url) {
    return this.#pool.get(url);
  }

  /**
   * Задає конфігурації з'єднання по клієнту
   * @param url url для з'єднання з AMQP-брокером
   * @param connection з'єднання з AMQP-брокером
   */
  setConnectionConfig(url, connection) {
    this.#pool.set(url, connection);
  }

  /**
   * @param client UUID клієнта
   * @returns {Map} Повертає конфігурацію з'єднання по клієнту
   */
  getClientConnection(client) {
    return [...this.#pool].find(([url, { clients }]) => clients.includes(client));
  }

  /**
   * Створює конфігурацію по клієнту
   * @param client UUID клієнта
   * @param options налаштування з'єднання з AMQP-брокером
   * @returns {} повертає з'єднання з AMQP-брокером
   */
  async getConnection(client, options) {
    ExplorerValidate.validateOptions(options);
    const existingConnection = this.getConnectionConfig(options.url);
    if (existingConnection) {
      if (!existingConnection.clients.includes(client)) {
        existingConnection.clients.push(client);
      }
      return existingConnection.connection;
    }
    this.setConnectionConfig(options.url, {
      connection: await amqplib.connect(options.url),
      clients: [client]
    });
    return this.getConnectionConfig(options.url).connection;
  }

  /**
   * Створює publisher
   * @params options налаштування публікувальника
   * @returns {Publisher} об'єкт класу {@link Publisher}
   */
  async createPublisher(options) {
    let calcOptions = deepClone(deepClone({}, defaultPublisherOptions), options || {});
    PublisherValidate.validateOptions(calcOptions);
    const publisher = new Publisher(this, calcOptions);
    await publisher.moduleInit();
    return publisher;
  }

  /**
   * Створює consumer
   * @returns {Object} об'єкт класу Consumer
   */
  async createConsumer(options) {
    const calcOptions = deepClone(deepClone({}, defaultConsumerOptions), options || {});
    ConsumerValidate.validateOptions(calcOptions);
    const consumer = new Consumer(this, calcOptions);
    await consumer.moduleInit();
    return consumer;
  }

  /**
   * Закриває з'днання по клієнту
   * @param client
   */
  async closeConnection(client) {
    const connectionConfig = this.getClientConnection(client);
    if (connectionConfig) {
      const clientIndex = connectionConfig[1].clients
        .findIndex(clientIteration => clientIteration === client);
      connectionConfig[1].clients.splice(clientIndex, 1);
      if (!connectionConfig[1].clients.length) {
        await connectionConfig[1].connection.close();
      }
    }
  }

  /**
   * Закриває з'єднання для всіх клієнтів
   */
  async clearAndShutdown() {
    const closeConnectionTasks = [];
    this.#pool.forEach(({ connection }) => {
      closeConnectionTasks.push(
        new Promise((resolve) => {
          connection.close().then(resolve);
        })
      );
    });
    await Promise.all(closeConnectionTasks);
    this.#pool.clear();
  }

  /**
   * @returns {size} повертає розмір pool-конфігурацій з'єднання
   */
  size() {
    return this.#pool.size;
  }
}

module.exports = AmqpManager.getInstance();
