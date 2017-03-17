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
var find = require('./find');

/**
 * Add a new row to the table
 *
 * @param {String}  connection The datastore name to query on.
 * @param {String}  collection The table name to create a record into
 * @param {Object}  query      The new record to be created
 * @param {Promise}            Unresolved promise if the created record,
 *                             otherwise an error throw during the operation
 */
var FindOne = function FindOne(collection, query , relations) {

    //funcion para no hacer esta consulta si el usuario no quiere
    //cuando la relacion es muchos a muchos
    //que esto de la relacion no solo sea para buscar uno
    //que se pueda adaptar para traer muchos datos
    //hacer una forma para que el usuario solo traiga una relacion especifica


    var findOneRelation = function (relation , item) {
        if (!_.isEmpty(relation) && !_.isNull(relation) && !_.isUndefined(relation)) {
            return find(relation , {
                where: {
                    id: item[relation]
                }
            }).then((data) => {
                item[relation] =  (data.length > 0) ? _.head(data) : null;
                return item;
            });
        }
    };

    var head = function head(documents) {;
        let item =  (documents.get().length > 0) ? _.head(documents.get()) : null;
        if (!_.isEmpty(relations) && !_.isNull(relations) && !_.isUndefined(relations)) {
            for (var relation in relations) {
                var row = findOneRelation(relations[relation], item);
            }
            return row;
        }
        return item;


    };

    return find(collection, query).then(head);
};

module.exports = FindOne;