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

var Data = require('./Data')
var _ = require('lodash');
var Promise = require('bluebird');
var WaterlineCriteria = require('waterline-criteria');

const connection =  require('../connections').firebase;

var database = connection.database();

var isPrimitive = function isPrimitive(value) {
    return _.isDate(value) || !_.isObject(value);
};

var isFindById = function isFindById(query) {
    if (_.isInteger(query) || _.isString(query)) {
        return true;
    }

    if (_.isInteger(query.where.id) || _.isString(query.where.id)) {
        return true;
    }

    return false;
};

var isFindByAttribute = function isFindByAttribute(query) {
    if (_.isEmpty(query) || _.isEmpty(query.where)) {
        return false;
    }

    if (isFindById(query)) {
        return false;
    }

    return !_.isArray(query.where) && _.isObject(query);
};

var isFindEqualTo = function isFindEqualTo(query) {

    return !_.isEmpty(_.omitBy(query.where, _.isObject));
};

var isFindGreaterThanOrEqualTo = function isFindLessThanOrEqualTo(query) {
    var inequalities = _.omitBy(query.where, isPrimitive);
    var lessThanOrEqual = _.omitBy(_.mapValues(inequalities, function(value, key) {
        return _.omit(value, ['<', 'lessThan', '<=', 'lessThanOrEqual']);
    }), _.isEmpty);

    return !_.isEmpty(lessThanOrEqual);
};

var greaterThanOrEqualTo = function greaterThanOrEqualTo(query) {
    var inequalities = _.omitBy(query.where, isPrimitive);
    var lessThanOrEqual = _.omitBy(_.mapValues(inequalities, function(value, key) {
        return _.omit(value, ['<', 'lessThan', '<=', 'lessThanOrEqual']);
    }), _.isEmpty);
    return _.keys(lessThanOrEqual);
};

var isFindLessThanOrEqualTo = function isFindLessThanOrEqualTo(query) {
    var inequalities = _.omitBy(query.where, isPrimitive);
    var lessThanOrEqual = _.omitBy(_.mapValues(inequalities, function(value, key) {
        return _.omit(value, ['>', 'greaterThan', '>=', 'greaterThanOrEqual']);
    }), _.isEmpty);

    return !_.isEmpty(lessThanOrEqual);
};

var lessThanOrEqualTo = function lessThanOrEqualTo(query) {
    var inequalities = _.omitBy(query.where, isPrimitive);
    var lessThanOrEqual = _.omitBy(_.mapValues(inequalities, function(value, key) {
        return _.omit(value, ['>', 'greaterThan', '>=', 'greaterThanOrEqual']);
    }), _.isEmpty);
    return _.keys(lessThanOrEqual);
};

var equalTo = function equalTo(query) {
    var criteria = _.omitBy(query.where, _.isObject);
    var sortBy = _.isString(query.sort) ? [ _.head(query.sort.split(' ')) ] : _.keys(query.sort);
    var attributes = _.keys(criteria);
    var bestAttributes = _.intersection(attributes, sortBy);
    return _.isEmpty(bestAttributes) ? _.head(attributes) : _.head(bestAttributes);
};

var onFind = function onFind(snapshot) {
    var documents = snapshot.exists() ? snapshot.val() : [];

    if (_.isEmpty(documents)) {
        return documents;
    }

    let values =  _.values(_.mapValues(documents, function(document, id) {
        document._id = id;
       return document;
    }));
    return new Data(values);
};

var findEqualTo = function findByAttribute(collection, query) {
    try {
        var reference = database.ref(collection);
        var attribute = equalTo(query);

        return reference.orderByChild(attribute)
            .equalTo(query.where[attribute])
            .once('value')
            .then(onFind);
    } catch (error) {
        return Promise.reject(error);
    }
};

var findGreaterThanOrEqualTo = function findGreaterThanOrEqualTo(collection, query) {
    try {
        var reference = database.ref(collection);
        var attribute = _.head(greaterThanOrEqualTo(query));
        var value = _.values(query.where[attribute])[0];

        return reference.orderByChild(attribute)
            .startAt(value)
            .once('value')
            .then(onFind);
    } catch (error) {
        return Promise.reject(error);
    }
};

var findLessThanOrEqualTo = function findLessThanOrEqualTo(collection, query) {
    try {
        var reference = database.ref(collection);
        var attribute = _.head(lessThanOrEqualTo(query));
        var value = _.values(query.where[attribute])[0];

        return reference.orderByChild(attribute)
            .endAt(value)
            .once('value')
            .then(onFind);
    } catch (error) {
        return Promise.reject(error);
    }
};

var findById = function findById(collection, query) {
    try {
        var reference = database.ref(collection);

        var onFindOne = function onFindOne(snapshot) {
            if (!snapshot.exists()) {
                return [];
            }

            var document = snapshot.val();
            document._id = snapshot.key;
            return new Data([ document ]);
        };

        return reference.child(query.where.id).once('value').then(onFindOne);
    } catch (error) {
        return Promise.reject(error);
    }
};

var findSlow = function findSlow(collection) {
    try {
        var reference = database.ref(collection);
        return reference.once('value').then(onFind);
    } catch (error) {
        return Promise.reject(error);
    }
};

/**
 * Add a new row to the table
 *
 * @param  {String}  connection The datastore name to query on.
 * @param  {String}  collection The table name to create a record into
 * @param  {Object}  query      The new record to be created
 * @return {Promise}            Unresolved promise if the created record,
 *                              otherwise an error throw during the operation
 */
var Find = function Find(collection, query) {
    var filter = function filter(documents) {
        return query ? new WaterlineCriteria(documents, query).results : documents;
    };

    if (_.isEmpty(query) || _.isEmpty(query.where)) {
        return findSlow(collection);
    }

    if (isFindById(query)) {
        return findById(collection, query);
    }

    if (isFindEqualTo(query)) {
        return findEqualTo(collection, query).then(filter);
    }

    if (isFindLessThanOrEqualTo(query)) {
        return findLessThanOrEqualTo(collection, query).then(filter);
    }

    if (isFindGreaterThanOrEqualTo(query)) {
        return findGreaterThanOrEqualTo(collection, query).then(filter);
    }

    return findSlow(collection).then(filter);
};

module.exports = Find;