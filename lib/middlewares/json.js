/* eslint-disable no-useless-catch */
/* eslint-disable no-param-reassign */
export const stringify = (err, msg, next) => {
  msg.content = JSON.stringify(msg.content);
  next();
};

export const parse = (err, msg, next) => {
  try {
    msg.content = JSON.parse(msg.content);
  } catch (e) {
    throw e;
  }
  next();
};
