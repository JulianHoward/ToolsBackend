const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/alquiler.controller.js");
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listAlquiler);
    router.get("/:id", checkUserMiddleware, controller.getAlquiler);
    router.get("/usuario/:usuarioFK", checkUserMiddleware, controller.getAlquilerByCliente);
    router.get("/producto/:productoFK", checkUserMiddleware, controller.getAlquilerByProducto);
    router.post("/", checkUserMiddleware, controller.createAlquiler);
    router.put("/:id", checkUserMiddleware, controller.updateAlquiler);
    router.patch("/:id", checkUserMiddleware, controller.updateAlquiler);
    router.delete("/:id", checkUserMiddleware, controller.deleteAlquiler);

    app.use("/api/alquileres", router);
}