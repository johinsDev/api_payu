module.exports.controller = function(app , controller , auth) {

    app.route('/checkout')
        .post(controller.payment );
    app.route('/banks')
        .get(controller.getBankList)
    app.route('/callback')
        .post(controller.notifyUrl );
};