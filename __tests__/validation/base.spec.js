const Validate = require('../../lib/validation/base');

describe('Base validate', () => {
  it('should return correct result from base check of options', () => {
    expect(Validate.validateOptions({})).toBeTruthy();
  });
});
