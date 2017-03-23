
var request = require('request');
const url = 'http://localhost:8005/sendpaymentsuccessful';


function SendEmail() {

    this.send = function (to , tickets) {
        const options = {
            url:  url,
            method: 'POST',
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: {
                to : to,
                parameters : tickets
            }
        };
        request(options, function(err, httpResponse, data) {
            if (err) {
                return Promise.reject(err)
            } else {
                console.log(data);
            }
        });
    };

    return this;
}


module.exports = SendEmail;