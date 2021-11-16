/* eslint-disable max-len */
const PublisherValidate = require('../../validation/publisher');

describe('Consumer validate', () => {
  it('should return correct error message with missing amqp, exchange, message properties', () => {
    try {
      PublisherValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect amqp property(object)', () => {
    try {
      PublisherValidate.validateOptions({ amqp: null });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect amqp property(missing url)', () => {
    try {
      PublisherValidate.validateOptions({ amqp: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect exchange property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect exchange property(missing nest properties)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect exchange/options/durable property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: {
            durable: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect exchange/options/autoDelete property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {
          options: {
            autoDelete: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect message property(object)', () => {
    try {
      PublisherValidate.validateOptions({
        message: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect message property(missing nest properties)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
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
      expect(err).toHaveProperty('message');
    }
  });

  it('should return correct error message with incorrect message/options/persistent property(boolean)', () => {
    try {
      PublisherValidate.validateOptions({
        message: {
          options: {
            persistent: null,
          },
        },
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });
});
