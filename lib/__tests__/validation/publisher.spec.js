/* eslint-disable prettier/prettier */
/* eslint-disable max-len */
import PublisherValidate from '../../validation/publisher';

describe('Consumer validate', () => {
  it('should return correct error message with missing amqp, exchange, message properties', () => {
    try {
      PublisherValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'amqp\''),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'exchange\''),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining('On "": must have required property \'message\''),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(object)', () => {
    try {
      PublisherValidate.validateOptions({ amqp: null });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(missing url)', () => {
    try {
      PublisherValidate.validateOptions({ amqp: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp": must have required property \'url\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect amqp property(need string)', () => {
    try {
      PublisherValidate.validateOptions({
        amqp: {
          url: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/amqp/url": url should be a valid AMQP-connection string',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange property(missing nest properties)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange": must have required property \'name\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange": must have required property \'mode\'',
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange": must have required property \'options\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/name property(string)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          name: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/name": Exchange name is required. It should be a string',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/mode property(string)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          mode: 0,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/mode": must be string',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/options property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/options": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/options property(missing properties)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/options": must have required property \'durable\''
        ),
      );
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/options": must have required property \'autoDelete\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/options/durable property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: {
            durable: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/options/durable": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect exchange/options/autoDelete property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: {
            autoDelete: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/exchange/options/autoDelete": must be boolean',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        message: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message property(missing nest properties)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message": must have required property \'options\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {
          options: null,
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options": must be object',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {
          options: {},
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options": must have required property \'persistent\'',
        ),
      );
    }
  });

  it('should return correct error message with incorrect message/options/persistent property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {
          options: {
            persistent: null
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty(
        'message',
        expect.stringContaining(
          'On "/message/options/persistent": must be boolean',
        ),
      );
    }
  });
});
