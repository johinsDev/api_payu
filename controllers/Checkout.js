var Order = require('../models/Order')
var Payu = require('../config/Payu');
const config = require('../config/services')
const payu = new Payu(config.payu);
var PayU = require('payu-pl'),
    merchantConfig = {
        merchantPosId: 508029, //test merchant id
        key: '4Vj8eK4rloUd272L48hsrarnUA', //test merchant key
        currencyCode: "COP"
    },
    merchant;
merchant = PayU.setDefaultMerchant(merchantConfig);
exports.payment = function(req, res) {
    Order.create(req.body , (key)  => {
        var testOrderData = {
            customerIp: "127.0.0.1",
            description: 'Test order',
            totalAmount: PayU.parsePrice(17.99), //or put string value in lowest currency unit
            products: [{
                name: 'Product 1',
                unitPrice: PayU.parsePrice(17.99),
                quantity:1
            }]
        };

        merchant.createOrder(testOrderData, function(err, response){
            console.log(err, response);
        });
    });

};
