const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/calificacion.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listCalificacion);
    router.get("/:id", checkUserMiddleware, controller.getCalificacion);
    router.get("/usuario/:usuarioFK", checkUserMiddleware, controller.getCalificacionByUsuario);
    router.get("/producto/:productoFK", checkUserMiddleware, controller.getCalificacionByProducto);
    router.get("/servicio/:servicioFK", checkUserMiddleware, controller.getCalificacionByServicio);
    router.post("/", checkUserMiddleware, controller.createCalificacion);
    router.put("/:id", checkUserMiddleware, controller.updateCalificacion);
    router.patch("/:id", checkUserMiddleware, controller.updateCalificacion);
    router.delete("/:id", checkUserMiddleware, controller.deleteCalificacion);

    app.use("/api/calificaciones", router);
}