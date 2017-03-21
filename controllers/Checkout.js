var Order = require('../models/Order');
var OrderItem = require('../models/OrderItem');
var Ticket = require('../models/Ticket');
var Payu = require('../config/Payu');
const config = require('../config/services');
const payu = new Payu(config.payu);

exports.payment = function(req, res) {
    Order.create(req.body , (order , key_order)  => {

        payu.generate(order , req.body , (error , data , payload) => {

            if (data.code = 'SUCCESS'){

                Ticket.find(req.body.ticket  , (ticket) => {
                    OrderItem.create(
                        req.body.data ,ticket, req.body.ticket ,req.body.quantity  , key_order
                    );
                });


                //if ( data.transactionResponse.responseCode == 'APPROVED'){
                    Order.update(key_order , data.transactionResponse.orderId);
                // }

                OrderItem.findByOrderId(key_order , (tickets) => {
                    let response = data.transactionResponse;
                    res
                        .status(201)
                        .json({status: response.state ,
                            coreError:response.responseCode,
                            data: {
                                tickets: tickets,
                                payer: req.body.user,
                                order: {
                                    total: payload.transaction.order.additionalValues.TX_VALUE.value,
                                    id: response.orderId ,
                                    quantity: req.body.quantity
                                }
                            }
                        })
                });

            }
        })
    });
};
