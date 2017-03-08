module.exports.controller = function(app , controller , auth) {

    app.use('/cards' , auth)

    app.route('/cards')
        .get(controller.index )

    app.route('/cards/create')
        .get(controller.create)
        .post(controller.store)

    app.route('/cards/:id/edit')
        .get(controller.edit)
        .post(controller.update)

    app.route('/cards/:id/delete')
        .get(controller.destroy)
};