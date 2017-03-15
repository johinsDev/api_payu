const connection =  require('../config/connections')
var table = 'tickets';
const waterlinefilter = require('waterline-criteria')
var _this = connection.firebase.database().ref(table);

function isArray(data)
{
    return (Object.prototype.toString.call( data ) === '[object Array]' )
}

function isNull(data)
{
    return (typeof data === "undefined" || data === null)
}

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

exports.get = function (cb) {
    _this.once('value' , (values) => {
        var rawdata = values.val()
        var parseData = [];

        for (var property in rawdata)
        {
            rawdata[property]['_id'] = property;
            if (rawdata.hasOwnProperty(property))
            {
                parseData.push(rawdata[property]);
            }
        }
        var data1 = waterlinefilter (parseData,{
            where: {
                'type':'etapa1'}
        }).results;
        var data2 = waterlinefilter (parseData,{
            where: {
                'type':'etapa2'}
        }).results;
        return cb({'Etapa1': data1 , 'Etapa2': data2})
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