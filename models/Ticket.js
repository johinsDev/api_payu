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
