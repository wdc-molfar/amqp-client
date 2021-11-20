const YAML = require('js-yaml');

const yaml2js = (yaml) => YAML.load(yaml.replace(/\t/gm, ' '));
const js2yaml = (js) => YAML.dump(js);

module.exports = { yaml2js, js2yaml };
