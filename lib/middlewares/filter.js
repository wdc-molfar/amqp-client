/* eslint-disable import/prefer-default-export */
/* eslint-disable no-useless-catch */
export const Filter = (predicate) => (err, msg, next) => {
  // if( err ) throw err
  try {
    if (predicate(msg)) next();
  } catch (e) {
    throw e;
  }
};
