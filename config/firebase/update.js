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
var createEach = require('./createEach');
var find = require('./find');

/**
 * Fired when a model is unregistered, typically when the server
 * is killed. Useful for tearing down remaining open applications,
 * etc.
 *
 * @param  {String}  application (optional) The datastore to tear down. If not
 * @param  {String}  collection  (optional) The datastore to tear down. If not
 * @param  {Object}  query       (optional) The datastore to tear down. If not
 * @param  {Object}  values      (optional) The datastore to tear down. If not
 * @return {Promise}             [description]
 */
var Update = function Update(collection, query, values) {
    var updateOne = function updateOne(document) {
        _.forIn(values, function (value, key) {
            document[key] = value;
        });

        return document;
    };

    var head = function head(documents) {
        return (documents.length > 0) ? _.head(documents) : null;
    };

        var updateEach = function updateEach(documents) {
            return  createEach(collection, _.map(documents, updateOne)).then(head);
        };

    return find(collection, query).then(updateEach);
};

module.exports = Update;