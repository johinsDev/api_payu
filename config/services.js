var jwt = require('jsonwebtoken');
var moment = require('moment');
var config = require('./auth');

exports.createToken = function(user) {
    return jwt.sign(user, config.TOKEN_SECRET , {
        expiresIn:  moment().add(14, "days").unix()
    });
};