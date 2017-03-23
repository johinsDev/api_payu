var Order = require('../models/Order');
var OrderItem = require('../models/OrderItem');
var Ticket = require('../models/Ticket');
var Payu = require('../config/Payu');
const config = require('../config/services');
const Email = require('../config/SendEmail');
const email = new Email()


function noe(i) {
    return [undefined, null, ''].indexOf(i) > -1;
}

exports.payment = function(req, res) {
    const payu = new Payu(config.payu);
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

//si es tambien posible crear la funcion de pagos recurrentes
//me gustaria que la configuracion general quede en el constructor de la clase
//y aparte tener los metodos principales ya configurados, validar tarjetas, obtener los bancos, metodos de pago
//pago pse, y en fin los demas, pero a la ves poder configurar las propias o en suu deefencto una global donde pasemos
//un payment method diferente
//seria bueno que los predifinidos tambien se pudieran alterar como payu.getListBank peor si quisiera , esditara , ese metodo con set
//generar un metodo execute
//intentar crear custom thro extection
//intentar regresar promise para que quede algo llamar funcion ,then y .catch
//que cada cosa quede dividida como el sdk de paypal
//una configuracion apra retornar errores en formato json
//coger los errores de payu y retornar como error
//crear modulo de constantes
//crear modulo de traduccion de errores y notificaciones
//genrar funcion para validar notification url
//finalmente crear fuciones de admin
//mirar la forma de que noto instanciar de nuevo payu


exports.getBankList = function (req, res) {
    const payu = new Payu(config.payu);
    payu.setBankList({
            "paymentMethod": "PSE",
            "paymentCountry": "CO"
        }).execute((err, data , payload) => {
            res
                .status(201)
                .json({banks: data.banks})
    });
};


exports.notifyUrl = function (req, res) {
   const payu = new Payu(config.payu);
   payu.consumeNotification(req)
       .then((response) =>{
           payu.doOrderDetailReporting(response.getResponse().reference_pol ,
               (err , data ) => {
               //if (data.result.status == 'SUCCESS'){
                   Order.update(response.getResponse().reference_sale , response.getResponse().reference_pol ,true);

                   OrderItem.findByOrderId(response.getResponse().reference_sale , (tickets) => {
                       email.send(response.getResponse().email_buyer , {tickets});
                   })

                   res
                       .status(200)
                       .json({});
               //}
           });
       })
       .catch((error) =>{
           console.log(error);
       });
};