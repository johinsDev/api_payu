var Checkout = require('../models/Checkout')

exports.payment = function(req, res) {
    res
        .status(200)
        .json({response: req.body})
};
