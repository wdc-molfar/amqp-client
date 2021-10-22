
const Filter = predicate => {
	return (err, msg, next) => {
		// if( err ) throw err
		try {
			if(predicate(msg)) next()
		} catch (e) {
			throw e
		}
	}

}

module.exports = Filter