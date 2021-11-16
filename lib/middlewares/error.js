const BreakChain = (err, msg, next) => {
  if (!err) {
    next();
  }
};

const Log = (err, msg, next) => {
  if (err) {
    console.log(err);
  }
  next();
};

module.exports = {
  BreakChain,
  Log,
};
