var _ = require('lodash');

function Data(values) {
    this.data = values;

    this.get = function () {
        return this.data;
    };

    this.groupBy = function (groupBy) {
        var props = [];
        props.push(groupBy);
        var notNull = _.negate(_.isNull);

        var groups = _.groupBy(this.get(), function(item){
            return _.find(_.pick(item, props), notNull);
        });

        this.data = groups;

        return this;
    }
}

module.exports = Data;