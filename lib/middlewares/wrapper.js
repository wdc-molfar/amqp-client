/* eslint-disable no-useless-catch */
class Middleware {
  #middlewares;
  #callback;

  constructor(callback) {
    this.#middlewares = [];
    this.#callback = callback;
    if (callback) {
      this.#middlewares.push(callback);
    }
  }

  use(callback) {
    if (this.#callback) this.#middlewares.pop();
    this.#middlewares = [
      ...this.#middlewares,
      ...(Array.isArray(callback) ? callback : [callback]),
    ];
    if (this.#callback) this.#middlewares.push(this.#callback);
    return this;
  }

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

export default Middleware;
