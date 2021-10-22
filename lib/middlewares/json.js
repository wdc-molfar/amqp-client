
const stringify = (err, msg, next) => {
	msg.content = JSON.stringify(msg.content)
	next()
}

const parse = (err, msg, next) => {
	try {
		msg.content = JSON.parse(msg.content)
	} catch (e) {
		throw e
	}
	next()	
}

module.exports = {
	stringify,
	parse
}