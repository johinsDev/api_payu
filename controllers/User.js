var User = require('../models/User')
const service  = require('../config/services')

exports.store = function (req , res) {

    if(!req.body) {
        res
            .status(403)
            .json({error: true, message: 'Body empty'})
    }

    let _user = req.body;

    User.create(_user)
        .then(function(user) {
            User.save(_user.email , _user.password , user.uid);
            let token = service.createToken(user)

            res
                .status(201)
                .json({user: user , token: token})
        })
        .catch(function(error) {
            res
                .status(402)
                .json({error: error.message})
        });

};

exports.auth = function (req , res) {
    if (!req.body){
        res
            .status(403)
            .json({error: 'No params body'})
    }

    User.auth(req.body.email)
        .then(function(user) {
            User.login(user.uid , (user) => {
                if (User.validateLogin(user , req.body)){
                    let token = service.createToken(user)

                    res
                        .status(201)
                        .json({ user , token })

                }else{
                    res
                        .status(403)
                        .json({error: 'Contraseña no valida para el usuario'})
                }
            })
        })

        .catch(function(error) {
            res
                .status(403)
                .json({error: 'Usuario no encontrado'})
        });
};
