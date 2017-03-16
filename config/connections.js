var admin = require('firebase-admin')
var serviceAccount = require('./api-payu-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://api-payu.firebaseio.com"
});

exports.firebase = admin;