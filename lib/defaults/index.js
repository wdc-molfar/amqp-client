const req = require('require-yml');

module.exports = {
  consumer: req(require.resolve('./yaml/consumer-options.yaml')),
  publisher: req(require.resolve('./yaml/publisher-options.yaml')),
};
