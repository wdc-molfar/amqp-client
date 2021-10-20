
const Middleware = class {
	constructor(){
		this.middlewares = []
	}

	use(callback){
		this.middlewares.push(callback)
		return this
	}

	async execute(...args){

		let res = args

		try {
			for(let i = 0; i< this.middlewares.length; i++){
				await this.middlewares[i](...res)
			}
			return res
		} catch (e) {
			throw e
		}	

	}

}


module.exports = Middleware

