/* eslint-disable no-unused-vars */
import { register, Counter } from 'prom-client';

const c = new Counter({
  name: 'test_msg',
  help: 'Example of msg counter',
  labelNames: ['receive', 'send'],
});

export const MonitorMetrics = (err, msg, next) => {
  const message = msg.content.data.slice(0, -2);
  if (msg.content.type === 'Send') {
    c.inc({ send: msg.content.data.slice(0, -2) });
  } else {
    c.inc({ receive: msg.content.data.slice(0, -2) });
  }
  next();
};
