const { assign, merge, keys, isFunction, isString, isArray, isDate, isNumber, isBoolean, set } = require("lodash")


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


const deepFilter = ( object, predicate, path) => {
  let result =  []

  path = path || []

  if ( predicate(object) ) result.push({
    path: path.map( d => d),
    instance: object
  })

  if( isString(object) || isBoolean(object) || isNumber(object) || isDate(object)) return result  

  if( isArray(object) ) {
    object.forEach( (f, index) => {
      path.push(index)
      if(!isFunction(f))  result = result.concat(deepFilter(f, predicate, path))
      path.pop()  
    })
  } else {

    keys(object).forEach( k => {
    path.push(k)
    if(!isFunction(object[k]))  result = result.concat(deepFilter(object[k], predicate, path))
    path.pop()  
  
  })
} 
  
  
  return result 
} 

module.exports = {
  deepFilter,
  deepExtend
}  