/* eslint-disable max-len */
const ExplorerValidate = require('../../validation/explorer');

describe('Explorer validate', () => {
  it('should return correct error message with missing url property', () => {
    try {
      ExplorerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect url property(need string)', () => {
    try {
      ExplorerValidate.validateOptions({
        url: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });
});
