const { assign, merge, keys, isFunction, isString, isArray, isDate, isNumber, isBoolean, set, find, findIndex } = require("lodash")
const amqp = require("amqplib")
const validate = require("./schemas").connection.validate
const YAML = require("js-yaml")

let pool = {}

const getConnection = async (client, options) => {
    if (!validate(options)) {
        throw new Error(validate.errors.map(e => `Cannot create connection. On ".${e.instancePath}": ${e.message}`).join("\n"))
    }

    if (pool[options.url]) {
        if (!pool[options.url].clients.includes(client)) {
            pool[options.url].clients.push(client)
        }
        return pool[options.url].connection
    } else {
        pool[options.url] = {
            connection: await amqp.connect(options.url),
            clients: [client]
        }
    }

    return pool[options.url].connection
}


const closeConnection = async client => {
    let conectionKey = find(keys(pool), c => pool[c].clients.includes(client))
    if (conectionKey) {
        let clientIndex = findIndex(pool[conectionKey].clients, c => c == client)
        if (clientIndex >= 0) {
            pool[conectionKey].clients.splice(clientIndex, 1)
            if (pool[conectionKey].clients.length == 0) {
                await pool[conectionKey].connection.close()
            }
        }
    }
    return
}



const deepExtend = (target, source) => {
    if (!(source instanceof Object)) {
        return source;
    }

    switch (source.constructor) {
        case Date:
            // Treat Dates like scalars; if the target date object had any child
            // properties - they will be lost!
            // let dateValue = (source as any) as Date;
            return new Date(source.getTime());

        case Object:
            if (target === undefined) {
                target = {};
            }
            break;

        case Array:
            // Always copy the array source and overwrite the target.
            target = [];
            break;

        default:
            // Not a plain Object - treat it as a scalar.
            return source;
    }

    for (let prop in source) {
        if (!Object.prototype.hasOwnProperty.call(source, prop)) continue;
        target[prop] = deepExtend(target[prop], source[prop]);
    }

    return target;
};


const deepFilter = (object, predicate, path) => {
    let result = []

    path = path || []

    if (predicate(object)) result.push({
        path: path.map(d => d),
        instance: object
    })

    if (isString(object) || isBoolean(object) || isNumber(object) || isDate(object)) return result

    if (isArray(object)) {
        object.forEach((f, index) => {
            path.push(index)
            if (!isFunction(f)) result = result.concat(deepFilter(f, predicate, path))
            path.pop()
        })
    } else {

        keys(object).forEach(k => {
            path.push(k)
            if (!isFunction(object[k])) result = result.concat(deepFilter(object[k], predicate, path))
            path.pop()

        })
    }


    return result
}


const createMessage = content => ({ content })


const Middleware = class {
    constructor(callback) {

        this.middlewares = []
        this.callback = callback
        if (callback) {
            this.middlewares.push(callback)
        }
    }

    use(callback) {
        callback = (isArray(callback)) ? callback : [callback]
        if (this.callback) this.middlewares.pop()
        this.middlewares = this.middlewares.concat(callback)
        if (this.callback) this.middlewares.push(this.callback)
        return this
    }

    async execute(...args) {


        try {

            let res = args
            let nextStatus = { status: true }
            let index = 0
            let error = null

            while (nextStatus.status) {

                nextStatus.status = false
                try {
                    if (this.middlewares[index]) await this.middlewares[index](error, ...res, () => { nextStatus.status = true })
                } catch (e) {
                    error = e
                    nextStatus.status = true
                }

                index++

            }

            return res

        } catch (e) {
            return res
        }

    }

}

const yaml2js = yaml => YAML.load(yaml.replace(/\t/gm, " "))

module.exports = {
    deepFilter,
    deepExtend,
    getConnection,
    closeConnection,
    Middleware,
    createMessage,
    yaml2js
}