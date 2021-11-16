const amqplib = require('amqplib');
const deepClone = require('../utils/deepClone');
const PublisherValidate = require('../validation/publisher');
const ConsumerValidate = require('../validation/consumer');
const ExplorerValidate = require('../validation/explorer');
const {
  publisher: defaultPublisherOptions,
  consumer: defaultConsumerOptions,
} = require('../defaults');
const Publisher = require('./publisher');
const Consumer = require('./consumer');
const { v4 } = require('uuid');

class AmqpExplorer {
  static #instance;

  #pool = new Map();

  constructor() {}

  static getInstance() {
    if (!AmqpExplorer.#instance) {
      AmqpExplorer.#instance = new AmqpExplorer();
    }
    return AmqpExplorer.#instance;
  }

  static get pool() {
    return this.#instance.#pool;
  }

  static set pool(newPool) {
    this.#instance.#pool = newPool;
  }

  getConnectionConfig(url) {
    return AmqpExplorer.#instance.#pool.get(url);
  }

  setConnectionConfig(url, connection) {
    AmqpExplorer.#instance.#pool.set(url, connection);
  }

  getClientConnection(client) {
    return [...AmqpExplorer.#instance.#pool].find(([url, { clients }]) => clients.includes(client));
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
    return publisher;
  }

  async createConsumer(options) {
    const calcOptions = deepClone(deepClone({}, defaultConsumerOptions), options || {});
    ConsumerValidate.validateOptions(calcOptions);
    const client = v4();
    const connection = await this.getConnection(client, calcOptions.amqp);
    const consumer = new Consumer(connection, client, calcOptions);
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
    AmqpExplorer.#instance.#pool.forEach(({ connection }) => {
      closeConnectionTasks.push(
        new Promise((resolve) => {
          connection.close().then(resolve);
        })
      );
    });
    await Promise.all(closeConnectionTasks);
    AmqpExplorer.#instance.#pool.clear();
  }

  size() {
    return AmqpExplorer.#instance.#pool.size;
  }
}

module.exports = AmqpExplorer;
