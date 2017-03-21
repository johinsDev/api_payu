var Order = require('../models/Order')
var Payu = require('../config/Payu');
const config = require('../config/services')
const payu = new Payu(config.payu);
exports.payment = function(req, res) {
    Order.create(req.body , (order)  => {
        payu.generate(order , req.body , (error , data , payload) => {
            if (data.code = 'ERROR'){

            }
            if (data.code = 'SUCCESS'){
                let response = data.transactionResponse;
                res
                    .status(201)
                    .json({status: response.state ,
                        coreError:response.responseCode,
                        data: {
                            tickets: {
                                id: '',
                                price: '',
                                category: '',
                                stage: '',
                                buyerName:'',
                                buyerCC: ''
                            },
                            order: {
                                total: payload.transaction.order.additionalValues.TX_VALUE.value,
                                id: response.orderId ,
                            }
                        }
                    })
            }

        })
    });
};
