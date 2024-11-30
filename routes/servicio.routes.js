const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/servicio.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listServicios);
    router.get("/:id", checkUserMiddleware, controller.getServicio);
    router.get("/categoria/:categoriaFK", checkUserMiddleware, controller.getServiciosByCategoria);
    router.get("/proveedor/:proveedorFK", checkUserMiddleware, controller.getServiciosByProveedor);
    router.post("/", checkUserMiddleware, controller.createServicio);
    router.put("/:id", checkUserMiddleware, controller.updateServicio);
    router.patch("/:id", checkUserMiddleware, controller.updateServicio);
    router.delete("/:id", checkUserMiddleware, controller.deleteServicio);
    router.post("/:id/image", checkUserMiddleware, controller.uploadImage);

    app.use("/api/servicios", router);
}