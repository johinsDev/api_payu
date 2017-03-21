var request = require('request');
var crypto = require('crypto');
const cmd = {
    CREATE_TOKEN: 'CREATE_TOKEN',
    SUBMIT_TRANSACTION: 'SUBMIT_TRANSACTION'
};
const LANGUAGE = {
    ES: 'es'
};

const type = {
    AUTHORIZATION_AND_CAPTURE: 'AUTHORIZATION_AND_CAPTURE'
};

const CURRENCY = {
    COLOMBIAN: 'COP'
};

const md5 = require('md5')

var payuPayload = {};

const Ticket = require('../models/Ticket')

const COUNTRY = {
    CO: 'es'
};
//falta actualizar la orden si quedo paga y con el orderid de payu
//falta tamvien crear order_tickets con order_id user_id y datos que vienen de cada boleta
//luego mirar como retornar esos datos

function PayU(config) {

    if (noe(config.payu_url)) {
        config.payu_url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
    }

    function get_hash(command, var1) {
        var s = crypto.createHash('sha512');
        s.update([merchant_id, command, var1, salt].join('|'));
        return s.digest('hex');
    }

    function https_post(payload, cb) {
        const options = {
            url: config.payu_url,
            method: 'POST',
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: payload
        };
        request(options, function(err, httpResponse, data) {
            if (err) {
                cb(err);
            } else {
                cb(err, data , payload);
            }
        });
    }

    function noe(i) {
        return [undefined, null, ''].indexOf(i) > -1;
    }
    //para mejorar una libreria como la de paypal
    //con cada item del array divido en clases, con setters y getters
    //custom try catch , poder configurar
    //si hay error interceptar error para de verdad retornar errores
    //validado todoa el payload
    //opcion de traducir errores
    //opcion de valdiar los diferentes tipos de pago par ano pedir tantos datos
    //si no pasa los datos que los traiga del algun lado como .env de laravel

    this.create_token_Card = function(data, cb) {

        var payload = {
            "language": COUNTRY['CO'],
            "command": cmd.CREATE_TOKEN,
            "merchant": {
                "apiLogin": config.api_login,
                "apiKey": config.api_key ,
            },
            creditCardToken: data,
        };

        https_post(payload, cb);
    };

    this.generate = function (order , data , cb) {

        Ticket.find(data.ticket , (ticket) => {
            this.setLanguage("ES");
            this.setCommand("SUBMIT_TRANSACTION");
            this.apiContext(config.api_key , config.api_login);
            let transaction = this.transaction();
            this.setOrder({
                "accountId": config.account_id,
                "referenceCode": order.key,
                "description": "Pago de boletas de clic",
                "language": LANGUAGE['ES'],
                "signature": this.createSignature(order.key , ticket.price * data.quantity , CURRENCY['COLOMBIAN']),
                "notifyUrl": config.notification_url,
                "additionalValues": {
                    "TX_VALUE": {
                        "value": ticket.price * data.quantity,
                        "currency": CURRENCY['COLOMBIAN']
                    }
                }
            }).setBuyer({
                "merchantBuyerId": order.customer,
                "fullName": data.user.name,
                "emailAddress": data.user.email,
                "dniNumber": data.user.identificationNumber,
                "shippingAddress": {
                    "street1": "CALLE 67A #60 - 46",
                    "city": "Bogota",
                    "state": "Bogota",
                    "country": "CO",
                }
            });
            transaction.setPayer({
                "fullName": data.user.name,
                "emailAddress": data.user.email
            });

            transaction.setCreditCard(true ,  data.credit_card);

            this.extra().setInstallments(1);

            transaction.setType('AUTHORIZATION_AND_CAPTURE');

            transaction.setPaymentMethod('VISA');

            transaction.setPaymentCountry('CO');


            transaction.isTest(false);
            https_post(payuPayload, cb);
        });
    };

    this.createSignature = function (referenceCode , amount , currency) {
        let message = config.api_key + "~" + config.merchant_id + "~" + referenceCode + "~" + amount + "~" + currency;
        return md5(message)
    };

    this.setCommand = function (COMMAND) {
        payuPayload.command = cmd[COMMAND];
    };

    this.setLanguage = function (language) {
        if (! LANGUAGE[language] || noe( LANGUAGE[language])){
            throw "Lenaguaje no encontrado";
        }
        payuPayload.language = LANGUAGE[language];
    };

    this.apiContext = function (api_key , api_login) {
        payuPayload.merchant = {
            "apiKey": api_key,
            "apiLogin": api_login
        };
    };

    this.transaction = function () {
        payuPayload.transaction = {};
        return this;
    };

    this.isTest = function (value) {
        payuPayload.test = value;
        return this;
    };

    this.setPayer = function (payload) {
        payuPayload.transaction.payer = payload;
        return this;
    };

    this.setCreditCard = function (token , payload) {
        if (!token){
            payuPayload.transaction. creditCard = payload;
        }else{
            payuPayload.transaction.creditCardTokenId = payload;
        }
    };

    this.extra = function () {
        payuPayload.transaction.extraParameters = {};
        return this;
    };

    this.setInstallments = function (num) {
        payuPayload.transaction.extraParameters.INSTALLMENTS_NUMBER = num;
        return this;
    };

    this.setType = function (value) {
        payuPayload.transaction.type = type[value];
    };

    this.setPaymentMethod = function (value) {
        payuPayload.transaction.paymentMethod = value;
    };

    this.setPaymentCountry = function (value) {
        payuPayload.transaction.paymentCountry = value;
    };

    this.setOrder = function (payload) {
        payuPayload.transaction.order = payload;
        return  this;
    };

    this.setBuyer = function (payload) {
        payuPayload.transaction.order.buyer = payload;
        return this;
    };

    return this;
}

module.exports = PayU;