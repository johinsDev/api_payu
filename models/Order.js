const connection =  require('../config/connections')
var table = 'orders';

var _this = connection.firebase.database().ref(table);



exports.create =  function (data , method , cb) {
    let user = connection.firebase.database().ref('users');
    //falta buscar usuario por correo para traerlo no crearlo

    let u = user.push();
    u.set(data.user);
    let user_key = u.key;

    let order = {
        total: 10000,
        customer: user_key,
        pay: false,
        payment_method: method ? method : 'credit_card',
        quantity: data.quantity
    };

    let row = _this.push();
    row.set(order);
    return cb(row , row.key);
};

exports.update = function (id , payu_order , bool) {
  connection.firebase.database().ref(table + '/' + id).once('value' , (order) => {
              let item = order.val();
              item['pay'] = bool;
              item['payu_order'] = payu_order ;
              return connection.firebase.database().ref(table + '/' + id).update(item)
    });
};

exports.filter = function (id , cb) {
    connection.firebase.database().ref(table + '/' + id).once('value' , (order) => {
        let item = order.val();
        cb(item);
    });
};