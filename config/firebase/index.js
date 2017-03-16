var Create = require('./create');
var Find = require('./find');
var FindOne = require('./findOne');
var Update = require('./update');
var Delete = require('./delete');
var With = require('./with');

module.exports = {
    'create': Create,
    'find': Find,
    'findOne': FindOne,
    'update': Update,
    'delete': Delete,
    'with': With
};