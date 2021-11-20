const amqplib = require('amqplib');
const deepClone = require('../utils/deepClone');
const PublisherValidate = require('../validation/publisher');
const ConsumerValidate = require('../validation/consumer');
const ExplorerValidate = require('../validation/explorer');
const msapi = require("@molfar/msapi-schemas");

const publisher = msapi.produceStrict.snippet.json;
const consumer =  msapi.consumeStrict.snippet.json;

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

  getConnectionConfig(url) {
    return AmqpManager.#instance.#pool.get(url);
  }

  setConnectionConfig(url, connection) {
    AmqpManager.#instance.#pool.set(url, connection);
  }

  getClientConnection(client) {
    return [...AmqpManager.#instance.#pool].find(([url, { clients }]) => clients.includes(client));
  }
  
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

  async createPublisher(options) {
    const calcOptions = deepClone(deepClone({}, defaultPublisherOptions), options || {});
    PublisherValidate.validateOptions(calcOptions);
    const client = v4();
    const connection = await this.getConnection(client, calcOptions.amqp);
    const publisher = new Publisher(connection, client, calcOptions);
    await publisher.moduleInit();
    return publisher;
  }

  async createConsumer(options) {
    const calcOptions = deepClone(deepClone({}, defaultConsumerOptions), options || {});
    ConsumerValidate.validateOptions(calcOptions);
    const client = v4();
    const connection = await this.getConnection(client, calcOptions.amqp);
    const consumer = new Consumer(connection, client, calcOptions);
    await consumer.moduleInit();
    return consumer;
  }

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

  size() {
    return AmqpManager.#instance.#pool.size;
  }
}

module.exports = AmqpManager;
