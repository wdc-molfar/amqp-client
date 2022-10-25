const YAML = require('js-yaml');
const JsonRefs = require("json-refs")

const yaml2js = (yaml) => YAML.load(yaml.replace(/\t/gm, ' '));

const js2yaml = (js) => YAML.dump(js);

const resolveRefs = async obj => {
	let {resolved, refs} = await JsonRefs.resolveRefs(obj)
	return resolved
}	

module.exports = { yaml2js, js2yaml, resolveRefs };
