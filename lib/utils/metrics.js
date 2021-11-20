const { register } = require('prom-client');

const getMetrics = async () => await register.getMetricsAsJSON();

module.exports = {
  getMetrics
};
