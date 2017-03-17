const Product = require('../models/Product');
const Test = require('../models/Test');

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


exports.index = function (req , res) {


    console.log(new Test().find('products')
        .then((val) => {
            res
                .status(200)
                .json({products: val.groupBy('stages').get()});
    }));
};
