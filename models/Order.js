const connection =  require('../config/connections')
var table = 'orders';

var _this = connection.firebase.database().ref(table);



exports.create =  function (data , cb) {
    let user = connection.firebase.database().ref('users');
    //falta buscar usuario por correo para traerlo no crearlo

    let u = user.push();
    console.log(u.key);
    u.set(data.user);
    let user_key = u.key;
    let order = {
        total: 10000,
        customer: user_key,
        pay: false,
        payment_method:'credit_card'
    };
    let row = _this.push();
    row.set(order);
    return cb(row.key);
};