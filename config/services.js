var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./auth');

exports.createToken = function(user) {
    return jwt.sign(user, config.TOKEN_SECRET , {
        expiresIn:  moment().add(14, "days").unix()
    });
};

exports.payu = {
    api_login: "pRRXKOl8ikMmt9u",
    api_key: "4Vj8eK4rloUd272L48hsrarnUA",
    account_id: "512321",
    merchant_id: "508029",
    url: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi',
    notification_url: "http://localhost:3001/callback"
}