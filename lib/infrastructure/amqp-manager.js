
const amqplib = require('amqplib');
const deepClone = require('../utils/deepClone');
const PublisherValidate = require('../validation/publisher');
const ConsumerValidate = require('../validation/consumer');
const ExplorerValidate = require('../validation/explorer');
const msapi = require("@molfar/msapi-schemas");


const {js2yaml} = require("../utils/format")

const defaultPublisherOptions = msapi.produceStrict.snippet.json;
const defaultConsumerOptions =  msapi.consumeStrict.snippet.json;

const Publisher = require('./publisher');
const Consumer = require('./consumer');
const { v4 } = require('uuid');

class AmqpManager {
  static #instance;

  #pool = new Map();

  constructor() {}

  static getInstance() {
    if (!AmqpManager.#instance) {
      AmqpManager.#instance = new AmqpManager();
    }
    return AmqpManager.#instance;
  }

  static get pool() {
    return this.#instance.#pool;
  }

  static set pool(newPool) {
    this.#instance.#pool = newPool;
  }

  /**
   * @returns {??} повертає конфігурацію з'єднання
   */
  getConnectionConfig(url) {
    return AmqpManager.#instance.#pool.get(url);
  }

  /**
   * Задає конфігурації з'єднання по клієнту
   */
  setConnectionConfig(url, connection) {
    AmqpManager.#instance.#pool.set(url, connection);
  }

  /**
   * @param client
   * @returns {???} Повертає конфігурацію з'єднання по клієнту
   */

  getClientConnection(client) {
    return [...AmqpManager.#instance.#pool].find(([url, { clients }]) => clients.includes(client));
  }

  /**
   * Створює конфігурацію по клієнту
   * @param client
   * @param options
   * @returns {} повертає існуючу конфігурацію або створену
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
   * @returns {Object} об'єкт класу Publisher
   */
  async createPublisher(options) {
    const calcOptions = deepClone(deepClone({}, defaultPublisherOptions), options || {});
    PublisherValidate.validateOptions(calcOptions);
    const client = v4();
    const connection = await this.getConnection(client, calcOptions.amqp);
    const publisher = new Publisher(this, connection, client, calcOptions);
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
    const client = v4();
    const connection = await this.getConnection(client, calcOptions.amqp);
    const consumer = new Consumer(this, connection, client, calcOptions);
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
   * Закриває з'днання для всіх клієнтів
   */
  async clearAndShutdown() {
    const closeConnectionTasks = [];
    AmqpManager.#instance.#pool.forEach(({ connection }) => {
      closeConnectionTasks.push(
        new Promise((resolve) => {
          connection.close().then(resolve);
        })
      );
    });
    await Promise.all(closeConnectionTasks);
    AmqpManager.#instance.#pool.clear();
  }

  /**
   * @returns {size} повертає розмір pool-конфігурацій з'єднання
   */
  size() {
    return AmqpManager.#instance.#pool.size;
  }
}

module.exports = AmqpManager.getInstance();
