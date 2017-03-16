var Model = require('../config/firebase/index');
const table = 'products';
var relation = [];

exports.create =  function (data , cb) {
    Model.create(table , data)
        .then(cb(data));
};

exports.find = function (id , cb) {
    Model.findOne(table , {
        where: {
            id: id
        }
    } , relation).then((item) => cb(item))
    return this;
};
