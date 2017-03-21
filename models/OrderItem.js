const connection =  require('../config/connections')
var table = 'orders_items';
var _this = connection.firebase.database().ref(table);
var uuid = require('node-uuid');

exports.create =  function (data , ticket , key , quantity , order_key) {
    for (var i = 0 ; i <= quantity; i++){
        var responses = [];
        let row = {
            id: uuid.v4(),
            price: ticket.price,
            category: ticket.category,
            stage: ticket.type,
            assist : data[i],
            order_id: order_key,
            ticket_id : key
        };
        responses.push(row);
        _this.push(row);
    }

    return responses;
};



exports.findByOrderId = function (id , cb) {
    _this.orderByChild('order_id').equalTo(id).once('value' , (snap) => {
        cb(snap.val())
    })
};