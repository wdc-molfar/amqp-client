/* eslint-disable no-param-reassign */

const deepClone = (target, source) => {
  const isObject = (obj) => obj && typeof obj === 'object';
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  if (source instanceof Date) {
    return new Date(source.getTime());
  }

  if (source instanceof Array) {
    return source.reduce((arr, item, i) => {
      target[i] = deepClone(target[i], item);
      return arr;
    }, []);
  }

  if (source instanceof Object) {
    return Object.keys(source).reduce((newObj, key) => {
      target[key] = deepClone(target[key], source[key]);
      return target;
    }, {});
  }
  return source;
};

module.exports = require("deep-extend") //deepClone;
