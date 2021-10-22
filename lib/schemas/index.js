const req = require('require-yml')
const publisherSchema = req(require.resolve("./yaml/publisher-schema.yaml"))
const consumerSchema = req(require.resolve("./yaml/consumer-schema.yaml"))
const connectionSchema = req(require.resolve("./yaml/connection-schema.yaml"))

const Ajv = require("ajv").default
const ajv = new Ajv({ allErrors: true })
// Ajv option allErrors is required
require("ajv-errors")(ajv /*, {singleError: true} */ )
const publisherValidate = ajv.compile(publisherSchema)
const consumerValidate = ajv.compile(consumerSchema)
const connectionValidate = ajv.compile(connectionSchema)


module.exports = {

    consumer: {
        schema: consumerSchema,
        validate: consumerValidate
    },
    publisher: {
        schema: publisherSchema,
        validate: publisherValidate
    },
    connection: {
        schema: connectionSchema,
        validate: connectionValidate
    }

}