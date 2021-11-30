const { register } = require('prom-client');

const getMetrics = () => register.getMetricsAsJSON();

module.exports = {
  getMetrics,
};
