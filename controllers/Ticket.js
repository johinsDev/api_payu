var Ticket = require('../models/Ticket')

exports.index = function(req, res) {

    Ticket.filter((tickets) => {
        res
            .status(200)
            .json({tickets: tickets})
    })

};

exports.find = function(req, res) {

    Ticket.find(req.params.id , (ticket) => {
        res
            .status(200)
            .json({ticket: ticket})
    })

};