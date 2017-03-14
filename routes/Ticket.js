module.exports.controller = function(app , controller) {

    app.route('/tickets')
        .get(controller.index )

    app.route('/tickets/:id')
        .get(controller.find )
};