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

  newInstance() {
    AmqpManager.#instance = null;
    return AmqpManager.getInstance();
  }

  get pool() {
    return this.#pool;
  }

  set pool(newPool) {
    this.#pool = newPool;
  }

  getConnectionConfig(url) {
    return this.#pool.get(url);
  }

  setConnectionConfig(url, connection) {
    this.#pool.set(url, connection);
  }

  getClientConnection(client) {
    return [...this.#pool].find(([url, { clients }]) => clients.includes(client));
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
    let calcOptions = deepClone(deepClone({}, defaultPublisherOptions), options || {});
    PublisherValidate.validateOptions(calcOptions);
    const publisher = new Publisher(this, calcOptions);
    await publisher.moduleInit();
    return publisher;
  }

  async createConsumer(options) {
    const calcOptions = deepClone(deepClone({}, defaultConsumerOptions), options || {});
    ConsumerValidate.validateOptions(calcOptions);
    const consumer = new Consumer(this, calcOptions);
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

  size() {
    return this.#pool.size;
  }
}

module.exports = AmqpManager.getInstance();
