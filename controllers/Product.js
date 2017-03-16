const Product = require('../models/Product');

exports.store = function (req , res) {
    Product.create(req.body , (data) => {
        res
            .status(201)
            .json({message: 'Producto creado correctamente' , product: data});
    });
};


exports.show = function (req , res) {
    Product.find(req.params.id , (data) => {
        res
            .status(200)
            .json({product: data});
    });
};
