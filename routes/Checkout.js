module.exports.controller = function(app , controller , auth) {

    app.route('/checkout')
        .post(controller.payment )
};