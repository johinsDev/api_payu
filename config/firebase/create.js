
var admin = require('firebase-admin');
var Promise = require('bluebird');

/**
 * Add a new row to the table
 *
 * @param {String}  connection The datastore name to query on.
 * @param {String}  collection The table name to create a record into
 * @param {Object}  document   The new record to be created
 * @param {Promise}            Unresolved promise if the created record,
 *                             otherwise an error throw during the operation
 */
var Create = function Create(collection, document) {

    const connection =  require('../connections').firebase;

    try {
        var database = connection.database();
        var reference = database.ref(collection);

        document._id = document._id || reference.push().key;

        if (!document.createdAt) {
            document.createdAt = document.updatedAt = new Date().toISOString();
        } else {
            document.updatedAt = new Date().toISOString();
        }

        return reference.child(document._id).set(document).then(() => document);
    } catch (error) {
        return Promise.reject(error);
    }
};

module.exports = Create;