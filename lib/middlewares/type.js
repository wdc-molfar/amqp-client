/* eslint-disable no-param-reassign */
const MsgType = (err, msg, next) => {
  msg.content.type = msg.content.type ? 'Receive' : 'Send';
  next();
};

const WithoutMsgType = (err, msg, next) => {
  delete msg.content.type;
  next();
};

module.exports = {
  MsgType,
  WithoutMsgType,
};
