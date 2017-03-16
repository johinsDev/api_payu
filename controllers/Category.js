const Category = require('../models/Category');

exports.store = function (req , res) {
    Category.create(req.body , (data) => {
        res
            .status(201)
            .json({message: 'Categoria creada correctamente' , data: data});
    });
};


exports.index = function (req , res) {
    Category.get((data) => {
        res
            .status(201)
            .json({categories: data});
    });
};


exports.show = function (req , res) {
    Category.find(req.params.id , (data) => {
        res
            .status(201)
            .json({category: data});
    });
};

exports.update = function (req , res) {
    Category.update(req.params.id , req.body , (data) => {
        res
            .status(201)
            .json({category: data});
    });
};

exports.destroy = function (req, res) {
    Category.destroy(req.params.id , () => {
        res
            .status(400)
            .json({})
    });
};