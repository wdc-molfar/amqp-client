/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
import ExplorerValidate from '../../validation/explorer';

describe('Explorer validate', () => {
  it('should return correct error message with missing url property', () => {
    try {
      ExplorerValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'Cannot create connection. On ".": Connection url is required'
        ),
      );
    }
  });

  it('should return correct error message with incorrect url property(need string)', () => {
    try {
      ExplorerValidate.validateOptions({
        url: null
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "./url": Connection url should be a valid RabbitMQ connection url',
        ),
      );
    }
  });
});
