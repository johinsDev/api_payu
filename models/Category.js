var Model = require('../config/firebase/index');
var _ = require('lodash');

const table = 'categories';

exports.create =  function (data , cb) {
    Model.create(table , data)
        .then(cb(data));
};

exports.get = function (cb) {
  Model.find(table)
      .then((items) => cb(items))
};

exports.find = function (id , cb) {
    Model.findOne(table , {
        where: {
            id: id
        }
    }).then((item) => cb(item))
};


exports.update = function (id , data , cb) {
    Model.update(table , {
        where: {
            id: id
        }
    } , data)
        .then((item) => cb(item))
};

exports.destroy = function (id , cb) {
  Model.delete(table , {
      where: {
          id: id
      }
  }).then(cb)
};