const cosmiconfig = require('cosmiconfig');
const { name } = require('../package.json');

const explorer = cosmiconfig(name, {
    searchPlaces: ['.simple-emoji-map', '.simple-emoji-map.json'],
});
const def = {
    shortnames: {},
    type: 'emoji',
    regex: null,
};
const defaults = (obj, defs) => Object.assign({}, obj, defs, obj);

module.exports = () =>
    explorer.search().then((e) => defaults(e && e.config, def));
