
module.exports.controller = function(app , controller , auth) {
    app.route('/stages')
        .post(controller.store);

    app.route('/stages')
        .get(controller.index);

    app.route('/stages/:id')
        .get(controller.show);

    app.route('/stages/:id')
        .put(controller.update);

    app.route('/stages/:id')
        .delete(controller.destroy)
};