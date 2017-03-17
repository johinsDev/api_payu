var Create = require('./create');
var Find = require('./find');
var FindOne = require('./findOne');
var Update = require('./update');
var Delete = require('./delete');


function Model() {

    this.create = Create;
    this.find = Find;
    this.findOne= FindOne;
    this.update= Update;
    this.delete= Delete;
    return this;
}

module.exports = Model;