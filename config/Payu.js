var request = require('request');
var crypto = require('crypto');
const cmd = {
    CREATE_TOKEN: 'CREATE_TOKEN',
    SUBMIT_TRANSACTION: 'SUBMIT_TRANSACTION'
};

function PayU(config) {
    const COUNTRY = 'es';
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
                cb(err, data);
            }
        });
    }

    function noe(i) {
        return [undefined, null, ''].indexOf(i) > -1;
    }

    this.create_token_Card = function(data, cb) {

        var payload = {
            "language": COUNTRY,
            "command": cmd.CREATE_TOKEN,
            "merchant": {
                "apiLogin": config.api_login,
                "apiKey": config.api_key ,
            },
            creditCardToken: data,
        };
        https_post(payload, cb);
    };

    this.create_payment= function (key , cb) {
        let payload = {
            "language": COUNTRY,
            "command": cmd.SUBMIT_TRANSACTION,
            "merchant": {
                "apiLogin": config.api_login,
                "apiKey": config.api_key ,
            },
            "transaction": {
                "order": {
                    "accountId": key,
                    "referenceCode": "payment_test_00000001",
                    "description": "payment test",
                    "language": "es",
                    "signature": "31eba6f397a435409f57bc16b5df54c3",
                    "notifyUrl": "http://www.tes.com/confirmation",
                    "additionalValues": {
                        "TX_VALUE": {
                            "value": 100,
                            "currency": "BRL"
                        }
                    },
                    "buyer": {
                        "merchantBuyerId": "1",
                        "fullName": "First name and second buyer  name",
                        "emailAddress": "buyer_test@test.com",
                        "contactPhone": "(11)756312633",
                        "dniNumber": "811.807.405-64",
                        "cnpj": "32593371000110",
                        "shippingAddress": {
                            "street1": "calle 100",
                            "street2": "5555487",
                            "city": "Sao paulo",
                            "state": "SP",
                            "country": "BR",
                            "postalCode": "01019-030",
                            "phone": "(11)756312633"
                        }
                    }
                },
                "creditCardTokenId": "8604789e-80ef-439d-9c3f-5d4a546bf637",
                "extraParameters": {
                    "INSTALLMENTS_NUMBER": 1
                },
                "type": "AUTHORIZATION",
                "paymentMethod": "VISA",
                "paymentCountry": "BR",
                "ipAddress": "127.0.0.1"
            },
            "test": true
        };
        https_post(payload, cb);
    };

    return this;
}

module.exports = PayU;