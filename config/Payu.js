var request = require('request');
var crypto = require('crypto');


const cmd = {
    CREATE_TOKEN: 'CREATE_TOKEN',
    SUBMIT_TRANSACTION: 'SUBMIT_TRANSACTION',
    GET_BANKS_LIST: 'GET_BANKS_LIST',
    ORDER_DETAIL: 'ORDER_DETAIL'
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

const md5 = require('md5');

var payuPayload = {};

const Ticket = require('../models/Ticket')

const COUNTRY = {
    CO: 'es'
};

const METHOD = {
    CO : [ 'MASTERCARD', 'BALOTO', 'BANK_REFERENCED', 'PSE', 'VISA', 'EFECTY', 'DINERS', 'AMEX', 'CODENSA'],
};

function PayU(config) {
    //constructor
    if (noe(config.payu_url)) {
        config.payu_url = 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi';
    }

    function get_hash(command, var1) {
        var s = crypto.createHash('sha512');
        s.update([merchant_id, command, var1, salt].join('|'));
        return s.digest('hex');
    }

    function https_post(payload, cb , url) {
        const options = {
            url: !url ? config.payu_url : url,
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
                //console.log(payload)
                //cleanPayload('bankListInformation');
                cb(err, data , payload);
            }
        });
    }

    function noe(i) {
        return [undefined, null, ''].indexOf(i) > -1;
    }
    function isEmptyObject(obj) {

        if (obj == null) return true;

        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;

        if (typeof obj !== "object") return true;

        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;

    }

    function validateMethod(method) {
        return METHOD.CO.indexOf(method.toUpperCase()) > -1
    }

    function isCard(method) {
        return !(['BALOTO', 'BANK_REFERENCED', 'PSE', 'EFECTY'].indexOf(method.toUpperCase()) > -1)
    }
    
    function isBankTransfer(method) {
        return (['PSE'].indexOf(method.toUpperCase()) > -1)
    }

    //retornar errores custom retornar promesas
    //validar mejor datos
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

    this.generate = function (order , data ,method , cb) {
        if (noe(method) || !validateMethod(method)){
           return cb(null ,{code: 'ERROR' , error: 'Metodo de pago no valido.'})
        }
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

            transaction.setPaymentMethod(method.toUpperCase());
            if (isCard(method)){

                transaction.setCreditCard(false ,  {
                    "number": data.card.number,
                    "securityCode": data.card.securityCode,
                    "expirationDate": data.card.expirationDate,
                    "name": data.user.name
                });

                this.extra().setInstallments(1);
            }

            if (isBankTransfer(method)){
                this.extra().setBank({
                    "RESPONSE_URL": "http://www.test.com/response",
                    "FINANCIAL_INSTITUTION_CODE": data.bank.bank,
                    "USER_TYPE": data.bank.type_client,
                    "PSE_REFERENCE3": data.user.identificationNumber
                });
            }

            transaction.setType('AUTHORIZATION_AND_CAPTURE');



            transaction.setPaymentCountry('CO');


            transaction.isTest(false);
            https_post(payuPayload, cb);
        });
    };
    
    this.setBank = function (payload) {
        payuPayload.transaction.extraParameters = payload;
    };

    this.createSignature = function (referenceCode , amount , currency) {
        let message = config.api_key + "~" + config.merchant_id + "~" + referenceCode + "~" + amount + "~" + currency;
        return md5(message)
    };

    this.setCommand = function (COMMAND) {
        payuPayload.command = cmd[COMMAND];
        return this;
    };

    this.setLanguage = function (language) {
        if (! LANGUAGE[language] || noe( LANGUAGE[language])){
            throw "Lenaguaje no encontrado";
        }
        payuPayload.language = LANGUAGE[language];
        return this;
    };

    this.apiContext = function (api_key , api_login) {
        payuPayload.merchant = {
            "apiKey": api_key,
            "apiLogin": api_login
        };
        return this;
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

    this.setBankList = function (payload) {
        payuPayload.bankListInformation = payload;
        return this;
    };

    this.execute = function (cb) {
        https_post(payuPayload, cb);
    };

    function cleanPayload(key) {
        delete payuPayload[key];
    };

    //constructor

    this.setLanguage("ES")
        .setCommand("GET_BANKS_LIST")
        .apiContext(config.api_key , config.api_login)
        .isTest(false);

    this.consumeNotification = function (data) {

        if (isEmptyObject(data.body)){
            return Promise.reject('Empty value data')
        }

        let headers = this.getRequestHeaders(data.headers)

        let signature = this.getSignature(headers);

        if(!this.verifyDocumentSignature(data.body , signature)){
            return Promise.reject('Sign is different')
        };

        return this.verifyResponse({'response' : data.body, 'code' : 200}, 'OrderNotifyRequest');
    };

    this.getRequestHeaders = function (headers) {
        headers['/X-OpenPayu-Signature/i'] ='signature' ;
        return headers;
    };

    this.getSignature = function (headers) {
        for(let header in headers)
        {
            if(header.match('/X-OpenPayu-Signature/i') || header.match('/OpenPayu-Signature/i'))
                return headers[header];
        }
        return null;
    };
    
    this.verifyDocumentSignature = function (data , signature) {
        let key = config.api_key;
        let merchant_id = data.merchant_id;
        let reference_sale = data.reference_sale;
        let value = data.value;
        value = value[value.length - 1] == 0 ? value.substr(0 , value.length - 1):value;
        let curency = data.currency;
        let state_pol = data.state_pol;
        let message = key + '~' + merchant_id + '~' + reference_sale + '~' + value + '~' + curency + '~' + state_pol;

        return md5(message) == data.sign;
    };

    var reponse = {};

    this.verifyResponse = function (response) {

        let httpStatus = response['code'];
        //let message = JSON.parse(response['response']);
        let message = response['response'];

        this.build(message);

        if (httpStatus == 200 || httpStatus == 201 || httpStatus == 422 || httpStatus == 301 || httpStatus == 302)
        {
            return Promise.resolve(this);
        } else {
            return Promise.reject('Method http not found')
        }
    };

    this.build = function (data) {
        reponse = data;
    };

    this.getResponse = function () {
        return reponse;
    };

    this.details = function () {
        payuPayload.details = {};
        return this;
    };

    this.setOrderId = function (id) {
        payuPayload.details.orderId = parseInt(id);
        return this;
    }

    this.doOrderDetailReporting = function (id , cb) {
        this.setCommand("ORDER_DETAIL").details().setOrderId(id)
        https_post(payuPayload , cb , 'https://sandbox.api.payulatam.com/reports-api/4.0/service.cgi')
    };

    return this;
}

module.exports = PayU;