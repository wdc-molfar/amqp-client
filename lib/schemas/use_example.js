let { validate } = require('.').consumer;

console.log('\nValidate Consumer default options...');
let spec = require('../defaults').consumer;

spec.queue.exchange.name = 'aaa';
spec.amqp = {
  url: 'amqp connection string',
}; // {url:  1}//"amqp connection string"}
console.log('is_valid = ', validate(spec));
console.log('Errors', validate.errors);

console.log('\nValidate Publisher default options...');
validate = require('.').publisher.validate;
spec = require('../defaults').publisher;

spec.exchange.name = 'aaa';
console.log('is_valid = ', validate(spec));
console.log('Errors', validate.errors);
