const YAML = require('js-yaml');

const yaml2js = (yaml) => YAML.load(yaml.replace(/\t/gm, ' '));

module.exports = { yaml2js };
