/* eslint-disable max-len */
const ManagerValidate = require('../../lib/validation/manager');

describe('Explorer validate', () => {
  it('should return correct error message with missing url property', () => {
    try {
      ManagerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect url property(need string)', () => {
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
