import Middleware from '../middlewares/wrapper';

class Consumer {
  #connection;
  #client;
  #options;
  #channel;
  #queue;
  #middleware;

  constructor(connection, client, options) {
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
          const nack = () => this.$channel.nack(msg);
          try {
            await this.#middleware.execute({ content: msg.content, ack, nack });
          } catch (e) {
            throw e;
          }
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async close(callback) {
    await this.#channel.close();
    await callback(this.#client);
  }
}

export default Consumer;
