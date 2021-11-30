/* eslint-disable no-useless-catch */
/**
 * @module Middleware
 * Middleware
 */
class Middleware {
  /**
   * @property {Array} middlewares - посилання на ланцюжок оброблення повідомлень
   */
  #middlewares;

  /**
   * @property {function} callback - обробник повідомлень за замовченням
   */
  #callback;

  /**
   * створює екземпляр масива посилань на ланцюжок оброблення повідомлень
   * @param {function} callback - обробник повідомлень
   * */
  constructor(callback) {
    this.#middlewares = [];
    this.#callback = callback;
    if (callback) {
      this.#middlewares.push(callback);
    }
  }

  /**
   * додає обробник до ланцюжка оброблення повідомлень
   * @param {function} callback - обробник повідомлень
   * */
  use(callback) {
    if (this.#callback) this.#middlewares.pop();
    this.#middlewares = [
      ...this.#middlewares,
      ...(Array.isArray(callback) ? callback : [callback]),
    ];
    if (this.#callback) this.#middlewares.push(this.#callback);
    return this;
  }

  /**
   * виконуе ланцюжщк оброблення повідомлень
   * */
  async execute(...args) {
    try {
      const res = args;
      const nextStatus = { status: true };
      let index = 0;
      let error = null;

      while (nextStatus.status) {
        nextStatus.status = false;
        try {
          if (this.#middlewares[index])
            await this.#middlewares[index](error, ...res, () => {
              nextStatus.status = true;
            });
        } catch (e) {
          error = e;
          nextStatus.status = true;
        }

        index++;
      }

      return res;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = Middleware;
