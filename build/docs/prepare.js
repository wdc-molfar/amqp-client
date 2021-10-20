const schemas = require("../../lib/schemas")
const fs = require("fs")
Object.keys(schemas).forEach( key => {
	console.log(`Prepare schema ./docs/schemas/json/${key}.schema.json`)
	fs.writeFileSync(`./docs/schemas/json/${key}.schema.json`, JSON.stringify(schemas[key].schema, null, " "))	
})
