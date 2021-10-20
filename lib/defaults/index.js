const req = require('require-yml')
module.exports = {
	consumer: req(require.resolve("./consumer-options.yaml")), 
	publisher: req(require.resolve("./publisher-options.yaml")) 
}

