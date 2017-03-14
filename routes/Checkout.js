module.exports.controller = function(app , controller , auth) {

    app.use('/checkout' , auth)

    app.route('/checkout')
        .post(controller.payment )
};