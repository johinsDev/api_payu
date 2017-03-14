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
    url: 'https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi'
}