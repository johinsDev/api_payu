var Model = require('../config/firebase');

var util = require('util');

function Test() {
    Model.call(this);
}

util.inherits(Test, Model);

module.exports = Test;