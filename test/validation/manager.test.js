/* eslint-disable max-len */
const ManagerValidate = require('../../lib/validation/manager');
const ManagerCaptions = require('./captions/manager');

describe(ManagerCaptions.managerDescription.ua, () => {
  it(ManagerCaptions.missingUrl.ua, () => {
    try {
      ManagerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(ManagerCaptions.incorrectUrl.ua, () => {
    try {
      ManagerValidate.validateOptions({
        url: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });
});
