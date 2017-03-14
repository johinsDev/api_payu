const connection =  require('../config/connections')
var table = 'tickets';

var _this = connection.firebase.database().ref(table);

exports.get = function (cb) {
    _this.once('value' , (values) => {
        return cb(values.val())
    }, () => {
        return cb(err)
    })
};

exports.filter = function (cb) {
    _this.orderByChild('category').startAt("estudiante").endAt("profesional").limitToLast(2).once('value' , (values) => {
        return cb(values.val())
    }, () => {
        return cb(err)
    })
}

exports.find = function (id , cb) {
    connection.firebase.database().ref('tickets/' + id).once('value')
        .then((snap) => cb(snap.val()))
        .catch((err) => cb(err))
};