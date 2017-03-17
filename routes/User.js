module.exports.controller = function(app , controller) {

    app.route('/users')
        .post(controller.store)

    app.route('/auth')
        .post(controller.auth)

};

//encontrar la forma que tome el modelo y asi cree la referencia amenos que se lo cambiemos
//al igual que el created at and updated at
//Editar el paquete para que ordene y agrupe
//seria tambien genial, lograr relaciones entre tablas de firebase
//create updatebyid y deletebyid
//metodos como count y sum por algun parametro
//validaciones como elemento ya eliminado o no encontrado
//poder crear accesors y mutators
//y porque no funciones de relaciones como laravel model.relathion
//o que las traiga dentro del modelo
//with como laravel
//relaciones como laravel
//schema como moongose y validaciones


//quiero que no retorne una promesa , encontrar la forma que devuelva un objeto
//de tipo modelo , con la funcion get como laravel
//y que este tenga el group by y esas cosas
//por lo pronto data que tenga las funciones de agregacion, que despues no toque pasar
//el nombre de la coleccion a menos qe lo digamos
//que las querys del where se concatenar
//Product.get((data) => {
//    res
//        .status(200)
//        .json({products: data});
//});