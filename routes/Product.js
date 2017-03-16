
module.exports.controller = function(app , controller , auth) {
    app.route('/products')
        .post(controller.store);
    app.route('/products/:id')
        .get(controller.show);
};