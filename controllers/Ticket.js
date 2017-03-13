var Ticket = require('../models/Ticket')

exports.index = function(req, res) {

    Ticket.filter((tickets) => {
        res
            .status(200)
            .json({tickets: tickets})
    })

};