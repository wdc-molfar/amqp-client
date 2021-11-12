export const BreakChain = (err, msg, next) => {
  if (!err) {
    next();
  }
};

export const Log = (err, msg, next) => {
  if (err) {
    console.log(err);
  }
  next();
};
