var Order = require('../models/Order');
var OrderItem = require('../models/OrderItem');
var Ticket = require('../models/Ticket');
var Payu = require('../config/Payu');
const config = require('../config/services');
const payu = new Payu(config.payu);


function noe(i) {
    return [undefined, null, ''].indexOf(i) > -1;
}

exports.payment = function(req, res) {
    if (noe(req.query.payment_method)){
        res
            .status(402)
            .json({errors: 'Metodo de pago nulo.'})
    }else{
        Order.create(req.body , req.query.payment_method , (order , key_order)  => {
            payu.generate(order , req.body , req.query.payment_method , (error , data , payload) => {
                    if (data.code == 'ERROR') {
                        res
                            .status(400)
                            .json({errors: data.error})
                    }
                    else if (data.code = 'SUCCESS'){

                    Ticket.find(req.body.ticket  , (ticket) => {
                        OrderItem.create(
                            req.body.data ,ticket, req.body.ticket ,req.body.quantity  , key_order
                        );
                    });


                    if ( data.transactionResponse.responseCode == 'APPROVED'){
                        Order.update(key_order , data.transactionResponse.orderId , true);
                    }

                    if ( data.transactionResponse.responseCode == 'PENDING'){
                        Order.update(key_order , data.transactionResponse.orderId , false);
                    }
                    OrderItem.findByOrderId(key_order , (tickets) => {
                    let response = data.transactionResponse;
                    res
                        .status(201)
                        .json({status: response.state ,
                            backUrlPdf: response.extraParameters ? response.extraParameters.URL_PAYMENT_RECEIPT_PDF : null,
                            backUrl: response.extraParameters ? response.extraParameters.URL_PAYMENT_RECEIPT_HTML : null,
                            bankUrl: response.extraParameters ? response.extraParameters.BANK_URL : null,
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
    }
};
