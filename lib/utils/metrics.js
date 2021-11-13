import { register } from 'prom-client';

export const getMetrics = async () => {
  console.log(await register.metrics());
};
