const Ajv = require("ajv").default
const ajv = new Ajv({allErrors: true})
require("ajv-errors")(ajv /*, {singleError: true} */)


const validator = schema => {
	const validate = ajv.compile(schema)
	
	return (err, msg, next) => {
		validate(msg.content)
		if(validate.errors){
			throw new Error(`Bad message format. 
${JSON.stringify(msg.content, null, "")}
${validate.errors.map(e => 'On the path "' + (e.instancePath || '#') + '": '+ e.message).join("")}`)
		}
		next()
	}
}  


module.exports = {
	validator
}