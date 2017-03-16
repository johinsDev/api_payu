/**
 * MIT License
 *
 * Copyright (c) 2017 Joao Paulo Fernandes Ventura
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


var _ = require('lodash');
var admin = require('firebase-admin');
var find = require('./find');
var Promise = require('bluebird');


const connection =  require('../connections').firebase;

var database = connection.database();
/**
 * Add a new row to the table
 *
 * @param {String}  connection The datastore name to query on.
 * @param {String}  collection The table name to create a record into
 * @param {Object}  query      The new record to be created
 * @param {Promise}            Unresolved promise if the created record,
 *                             otherwise an error throw during the operation
 */
var Destroy = function Destroy(collection, query) {

    try {
        var reference = database.ref(collection);

        var destroyOne = function (document) {
            return reference.child(document._id).set(null).then(function() {
                return document;
            });
        };

        var destroyEach = function (documents) {
            return Promise.all(_.map(documents, destroyOne));
        };

        var reportDeletedDocumentsNumber = function (documents) {
            return { numRecordsDeleted: documents.length };
        };

        return find(collection, query)
            .then(destroyEach)
            .then(reportDeletedDocumentsNumber);
    } catch (error) {
        return Promise.reject(error);
    }

};

module.exports = Destroy;