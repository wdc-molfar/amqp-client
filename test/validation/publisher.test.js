/* eslint-disable max-len */
const PublisherValidate = require('../../lib/validation/publisher');
const PublisherCaptions = require('./captions/publisher');

describe(PublisherCaptions.publisherDescription.ua, () => {
  it(PublisherCaptions.missingAmqpExchangeMessage.ua, () => {
    try {
      PublisherValidate.validateOptions({});
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectAmqp.ua, () => {
    try {
      PublisherValidate.validateOptions({ amqp: null });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectAmqpMissingUrl.ua, () => {
    try {
      PublisherValidate.validateOptions({ amqp: {} });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectAmqpNoValidUrl.ua, () => {
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

  it(PublisherCaptions.incorrectExchange.ua, () => {
    try {
      PublisherValidate.validateOptions({
        exchange: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectExchangeMissingNestProperties.ua, () => {
    try {
      PublisherValidate.validateOptions({
        exchange: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectExchangeNoValidName.ua, () => {
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

  it(PublisherCaptions.incorrectExchangeNoValidMode.ua, () => {
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

  it(PublisherCaptions.incorrectExchangeOptions.ua, () => {
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

  it(PublisherCaptions.incorrectExchangeOptionsMissingNestProperties.ua, () => {
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

  it(PublisherCaptions.incorrectExchangeOptionsNoValidDurable.ua, () => {
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

  it(PublisherCaptions.incorrectExchangeOptionsNoValidAutoDelete.ua, () => {
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

  it(PublisherCaptions.incorrectMessage.ua, () => {
    try {
      PublisherValidate.validateOptions({
        message: null,
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectMessageMissingNestProperties.ua, () => {
    try {
      PublisherValidate.validateOptions({
        message: {},
      });
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect(err).toHaveProperty('message');
    }
  });

  it(PublisherCaptions.incorrectMessageOptions.ua, () => {
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

  it(PublisherCaptions.incorrectMessageOptionsMissingNestProperties.ua, () => {
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

  it(PublisherCaptions.incorrectMessageOptionsNoValidPersistent.ua, () => {
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
