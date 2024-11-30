const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
module.exports = app => {
    const controller = require("../controllers/catHerramienta.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listCategoriasHerramientas);
    router.get("/:id", checkUserMiddleware, controller.getCategoriasHerramientas);
    router.post("/", checkUserMiddleware, controller.createCategoriaHerramienta);
    router.put("/:id", checkUserMiddleware, controller.updateCategoriaHerramienta);
    router.patch("/:id", checkUserMiddleware, controller.updateCategoriaHerramienta);
    router.delete("/:id", checkUserMiddleware, controller.deleteCategoriaHerramienta);

    app.use("/api/categorias-herramientas", router);
}