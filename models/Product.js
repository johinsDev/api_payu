var Model = require('../config/firebase/index');
const table = 'products';
var relations = ['stages'];

exports.create =  function (data , cb) {
    Model.create(table , data)
        .then(cb(data));
};

exports.find = function (id , cb) {
    Model.findOne(table , {
        where: {
            id: id
        }
    } , relations).then((item) => cb(item))
    return this;
};



exports.get = function (cb) {
    Model.find(table)
        .then((items) => cb(items))
    return this;
};