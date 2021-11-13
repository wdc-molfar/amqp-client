import { connect } from 'amqplib';
import deepClone from '../utils/deepClone';
import PublisherValidate from '../validation/publisher';
import ConsumerValidate from '../validation/consumer';
import ExplorerValidate from '../validation/explorer';
import {
  publisher as defaultPublisherOptions,
  consumer as defaultConsumerOptions,
} from '../defaults';
import Publisher from './publisher';
import Consumer from './consumer';
import { v4 } from 'uuid';

class AmqpExplorer {
  static instance;

  pool = new Map();

  constructor() {}

  static getInstance() {
    if (!AmqpExplorer.instance) {
      AmqpExplorer.instance = new AmqpExplorer();
    }
    return AmqpExplorer.instance;
  }

  getConnectionConfig(url) {
    return AmqpExplorer.instance.pool.get(url);
  }

  setConnectionConfig(url, connection) {
    AmqpExplorer.instance.pool.set(url, connection);
  }

  getClientConnection(client) {
    return [...AmqpExplorer.instance.pool].find(([url, { clients }]) => clients.includes(client));
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
      connection: await connect(options.url),
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
    AmqpExplorer.pool.forEach(({ connection }) => {
      closeConnectionTasks.push(
        new Promise((resolve) => {
          connection.close().then(resolve);
        })
      );
    });
    await Promise.all(closeConnectionTasks);
    AmqpExplorer.pool.clear();
  }

  size() {
    return AmqpExplorer.pool.size;
  }

}

export default AmqpExplorer;
