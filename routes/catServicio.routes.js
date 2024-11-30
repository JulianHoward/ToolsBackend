const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
module.exports = app => {
    const controller = require("../controllers/catServicio.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listCategoriasServicios);
    router.get("/:id", checkUserMiddleware, controller.getCategoriasServicios);
    router.post("/", checkUserMiddleware, controller.createCategoriaServicio);
    router.put("/:id", checkUserMiddleware, controller.updateCategoriaServicio);
    router.patch("/:id", checkUserMiddleware, controller.updateCategoriaServicio);
    router.delete("/:id", checkUserMiddleware, controller.deleteCategoriaServicio);

    app.use("/api/categorias-servicios", router);
}
