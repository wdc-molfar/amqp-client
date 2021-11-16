const { register } = require('prom-client');

const getMetrics = async () => {
  console.log(await register.metrics());
};

module.exports = {
  getMetrics,
};
