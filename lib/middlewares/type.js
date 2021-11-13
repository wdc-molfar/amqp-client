/* eslint-disable no-param-reassign */
export const MsgType = (err, msg, next) => {
  msg.content.type = msg.content.type ? 'Receive' : 'Send';
  next();
};

export const WithoutMsgType = (err, msg, next) => {
  delete msg.content.type;
  next();
};
