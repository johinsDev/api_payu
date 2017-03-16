
module.exports.controller = function(app , controller , auth) {
    app.route('/categories')
        .post(controller.store);

    app.route('/categories')
        .get(controller.index);

    app.route('/categories/:id')
        .get(controller.show);

    app.route('/categories/:id')
        .put(controller.update);

    app.route('/categories/:id')
        .delete(controller.destroy)
};