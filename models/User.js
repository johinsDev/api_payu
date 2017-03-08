const connection =  require('../config/connections')
const waterlinefilter = require('waterline-criteria')
const crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'mocion.2040'

var table = 'users';

var _this = connection.firebase.database().ref(table);

function isArray(data)
{
    return (Object.prototype.toString.call( data ) === '[object Array]' )
}

function isNull(data)
{
    return (typeof data === "undefined" || data === null)
}

function encrypt(text) {
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
}

function decrypt(text) {
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8')
    return dec
}

exports.save = function (email , password, uid) {
    var ref = _this.push();

    return ref.set({
        email: email,
        password: encrypt(password),
        UID: uid
    });
};

exports.create =  function (data) {
    return connection.firebase.auth().createUser({
        email: data.email,
        emailVerified: false,
        password: data.password,
        disabled: false
    })
};

exports.auth = function (email) {
    return connection.firebase.auth().getUserByEmail(email);
};

exports.token = function (user) {
    return connection.firebase.auth().createCustomToken(user.UID);
};

exports.login = function(key , cb) {
    return _this.orderByChild('UID').equalTo(key)
        .once('value', function (dataSnapshot) {
            var rawdata = dataSnapshot.val()
            var data = []
            for (var property in rawdata)
            {
                if (rawdata.hasOwnProperty(property))
                {
                    data.push(rawdata[property]);
                }
            }
            var halfwaydata = outputFormat(data);

            var data = waterlinefilter (halfwaydata,{
                where: {
                    'UID':key}
            }).results;

            return cb(getFindData(data));
    }, function (err) {
        return cb(err)
    });
};
function getFindData(data){
    return data.length ? data[0] : null;
}

exports.validateLogin = function(user , data) {
  return  (user.email == data.email && decrypt(user.password) == data.password);
};

function outputFormat(values)
{
    if( isArray(values) )
    {
        var arrayoutput = []
        for (var i = values.length - 1; i >= 0; i--) {
            arrayoutput.unshift(outputFormatHelper(values[i]))
        };
        return arrayoutput;
    }
    else return outputFormatHelper(values)

}
function outputFormatHelper(values)
{

    if(!isNull(values))
    {
        values.createdAt = new Date(values.createdAt)
        values.updatedAt = new Date(values.updatedAt)
        for (var property in values)
        {
            if (values.hasOwnProperty(property))
            {
                if(values[property]=="{specialtype: null}") values[property] = null;
                try
                {
                    var temp =  Date.parse(values[property])
                    if(iDate(temp)) values[property] = temp;
                }
                catch(e){}
            }
        }
        return values

    }
    else return null
}