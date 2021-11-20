/* eslint-disable no-unused-vars */
// const { register, Counter } = require('prom-client');

// const c = new Counter({
//   name: 'test_msg',
//   help: 'Example of msg counter',
//   labelNames: ['receive', 'send'],
// });

// const MonitorMetrics = (err, msg, next) => {
//   const message = msg.content.data.slice(0, -2);
//   if (msg.content.type === 'Send') {
//     c.inc({ send: msg.content.data.slice(0, -2) });
//   } else {
//     c.inc({ receive: msg.content.data.slice(0, -2) });
//   }
//   next();
// };

// module.exports = {
//   MonitorMetrics,
// };


/* eslint-disable no-unused-vars */
module.exports = options => (err, msg, next) => {
  options.callback(err, msg, options.metric)
  next();
}
