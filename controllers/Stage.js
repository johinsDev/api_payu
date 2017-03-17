const stage = require('../models/Stage');
const Stage = new stage();
const table = 'stages';

exports.store = function (req , res) {
    Stage.create(table , req.body).then((data) => {
        res
            .status(201)
            .json({message: 'Etapa creada correctamente' , data: data});
    });
};


exports.index = function (req , res) {
    Stage.find(table , {}).then(
        (data) => {
            res
                .status(201)
                .json({stages: data.get()});
        }
    );
};


exports.show = function (req , res) {
    let query = {
        where: {
            id:  req.params.id
        }
    };
    Stage.findOne(table , query)
        .then( (data) => {
        res
            .status(201)
            .json({stage: data});
        })
};

exports.update = function (req , res) {
    let query = {
        where: {
            id:  req.params.id
        }
    };
    Stage.update(table , query , req.body).then(
        (data) => {
            res
                .status(201)
                .json({stage: data});
        }
    );
};

exports.destroy = function (req, res) {
    let query = {
        where: {
            id:  req.params.id
        }
    };
    Stage.delete(table , query).then(
        () => {
            res
                .status(400)
                .json({})
        }
    );
};