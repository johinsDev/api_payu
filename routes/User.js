module.exports.controller = function(app , controller) {

    app.route('/users')
        .post(controller.store)

    app.route('/auth')
        .post(controller.auth)

};