const Ajv = require("ajv").default
const ajv = new Ajv({ allErrors: true })
require("ajv-formats")(ajv)
require("ajv-errors")(ajv /*, {singleError: true} */ )

const schemas = require("@molfar/msapi-schemas")

module.exports = {

    consumer: {
        schema: schemas.consumer.json,
        validate: ajv.compile(schemas.consumer.json)
    },
    publisher: {
        schema: schemas.publisher.json,
        validate: ajv.compile(schemas.publisher.json)
    },
    connection: {
        schema: schemas.connection.json,
        validate: ajv.compile(schemas.connection.json)
    }

}