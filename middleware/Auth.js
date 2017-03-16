'use strict'
const jwt = require('jsonwebtoken')
const config = require('../config/auth')
var moment = require('moment');

const auth = (req, res, next) => {
    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }
    var token = req.headers.authorization.split(" ")[1];

    var payload = jwt.decode(token, config.TOKEN_SECRET);

    if (payload){
        if(payload.exp <= moment().unix()) {
            return res
                .status(401)
                .send({message: "El token ha expirado"});
        }
    }

    if(token) {
        jwt.verify(token, config.TOKEN_SECRET , (err, decoded) => {
            if(err) {
                res
                    .status(403)
                    .json({error:true, message:'El token no existe o no es valido'})
            }
            else {
                req.decoded = decoded
                next()
            }
        });
    }
    else {
        res
            .status(403)
            .json({error:true, message:'Necesitas Login'})
    }

}

module.exports = auth