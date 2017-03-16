

var With = function (value) {
    this.relations = value;

    this.getRelation = function () {
        console.log(this.relations);
    };

    return this
};

module.exports = With;