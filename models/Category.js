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

//encontrar la forma que tome el modelo y asi cree la referencia amenos que se lo cambiemos
//al igual que el created at and updated at
//Editar el paquete para que ordene y agrupe
//seria tambien genial, lograr relaciones entre tablas de firebase
//create updatebyid y deletebyid
//metodos como count y sum por algun parametro
//validaciones como elemento ya eliminado o no encontrado
//poder crear accesors y mutators
//y porque no funciones de relaciones como laravel model.relathion
//o que las traiga dentro del modelo

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