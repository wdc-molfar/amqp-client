const Middlewares = require('./middlewares');
const { yaml2js, js2yaml } = require('./utils/format');
const deepClone = require('./utils/deepClone');

const AmqpManager = require('./infrastructure/amqp-manager');

const { getMetrics } = require('./utils/metrics');

module.exports = {
  AmqpManager,
  Middlewares,
  getMetrics,
  yaml2js,
  js2yaml,
  deepClone,
  deepExtend: deepClone
};
