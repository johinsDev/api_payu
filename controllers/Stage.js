const Category = require('../models/Stage');

exports.store = function (req , res) {
    Category.create(req.body , (data) => {
        res
            .status(201)
            .json({message: 'Etapa creada correctamente' , data: data});
    });
};


exports.index = function (req , res) {
    Category.get((data) => {
        res
            .status(201)
            .json({stages: data});
    });
};


exports.show = function (req , res) {
    Category.find(req.params.id , (data) => {
        res
            .status(201)
            .json({stage: data});
    });
};

exports.update = function (req , res) {
    Category.update(req.params.id , req.body , (data) => {
        res
            .status(201)
            .json({stage: data});
    });
};

exports.destroy = function (req, res) {
    Category.destroy(req.params.id , () => {
        res
            .status(400)
            .json({})
    });
};