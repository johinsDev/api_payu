var Checkout = require('../models/Checkout')
var Payu = require('../config/Payu');
const config = require('../config/services')
const payu = new Payu(config.payu);

exports.payment = function(req, res) {
    payu.create_payment((error , data) => {
        res
            .status(200)
            .json({response: data})
    });
};
