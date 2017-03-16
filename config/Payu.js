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

    this.create_payment= function (cb) {
        let payload = {
            "language": COUNTRY,
            "command": cmd.SUBMIT_TRANSACTION,
            "merchant": {
                "apiLogin": config.api_login,
                "apiKey": config.api_key ,
            },
            "transaction": {
                "order": {
                    "accountId": "512321",
                    "referenceCode": "payment_test_00000001",
                    "description": "payment test",
                    "language": "es",
                    "signature": "971dd1f8bd4c7b43eae2233464d4c97e",
                    "notifyUrl": "http://www.tes.com/confirmation",
                    "additionalValues": {
                        "TX_VALUE": {
                            "value": 10000,
                            "currency": "COP"
                        }
                    },
                    "buyer": {
                        "merchantBuyerId": "1",
                        "fullName": "First name and second buyer  name",
                        "emailAddress": "buyer_test@test.com",
                        "contactPhone": "7563126",
                        "dniNumber": "5415668464654",
                        "shippingAddress": {
                            "street1": "calle 100",
                            "street2": "5555487",
                            "city": "Medellin",
                            "state": "Antioquia",
                            "country": "CO",
                            "postalCode": "000000",
                            "phone": "7563126"
                        }
                    },
                    "shippingAddress": {
                        "street1": "calle 100",
                        "street2": "5555487",
                        "city": "Medellin",
                        "state": "Antioquia",
                        "country": "CO",
                        "postalCode": "0000000",
                        "phone": "7563126"
                    }
                },
                "payer": {
                    "merchantPayerId": "1",
                    "fullName": "First name and second payer name",
                    "emailAddress": "payer_test@test.com",
                    "contactPhone": "7563126",
                    "dniNumber": "5415668464654",
                    "billingAddress": {
                        "street1": "calle 93",
                        "street2": "125544",
                        "city": "Bogota",
                        "state": "Bogota DC",
                        "country": "CO",
                        "postalCode": "000000",
                        "phone": "7563126"
                    }
                },
                "creditCard": {
                    "number": "4097440000000004",
                    "securityCode": "321",
                    "expirationDate": "2014/12",
                    "name": "REJECTED"
                },
                "extraParameters": {
                    "INSTALLMENTS_NUMBER": 1
                },
                "type": "AUTHORIZATION_AND_CAPTURE",
                "paymentMethod": "VISA",
                "paymentCountry": "CO",
                "deviceSessionId": "vghs6tvkcle931686k1900o6e1",
                "ipAddress": "127.0.0.1",
                "cookie": "pt1t38347bs6jc9ruv2ecpv7o2",
                "userAgent": "Mozilla/5.0 (Windows NT 5.1; rv:18.0) Gecko/20100101 Firefox/18.0"
            },
            "test": false
        }
        https_post(payload, cb);
    };

    return this;
}

module.exports = PayU;