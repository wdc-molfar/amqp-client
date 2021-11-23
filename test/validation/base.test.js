const Validate = require('../../lib/validation/base');
const BaseCaptions = require('./captions/base');

describe(BaseCaptions.baseDescription.ua, () => {
  it(BaseCaptions.baseCheckOptions.ua, () => {
    expect(Validate.validateOptions({})).toBeTruthy();
  });
});
