
const BreakChain = ( err, msg, next) => {
	if(err){
		return
	} else {
		next()
	}
}

const Log = ( err, msg, next) => {
	if(err){
		console.log(err)
	}
	next()
}

module.exports = {
	Log,
	BreakChain
}