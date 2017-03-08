const connection =  require('../config/connections')
var table = 'cards';

var _this = connection.firebase.database().ref(table);



exports.create =  function (data) {
    data['last_number'] = data.number.substr(data.number.length  - 4);
    return _this.push(data)
};

exports.update = function (id , data) {
    let payload = {};
    data['last_number'] = data.number.substr(data.number.length  - 4);
    payload[id] = data;

    return _this.update(payload)
};

exports.find = function (id) {
   return  connection.firebase.database().ref('cards/' + id).once('value');
};

exports.get = function () {
    return _this.once('value');
};

exports.destroy = function (id) {
    connection.firebase.database().ref('cards/' + id).remove()
}