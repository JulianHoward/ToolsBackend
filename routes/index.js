module.exports = app => {
    require("./user.routes")(app);
    require("./authUser.routes")(app);
    require("./catServicio.routes")(app);
    require("./catHerramienta.routes")(app);
    require("./servicio.routes")(app);
    require("./producto.routes")(app);
    require("./pago.routes")(app);
    require("./contrato.routes")(app);
    require("./calificacion.routes")(app);
    require("./alquiler.routes")(app);
}