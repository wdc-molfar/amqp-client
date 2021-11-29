module.exports = (options) => (err, msg, next) => {
  options.callback(err, msg, options.metric);
  next();
};
