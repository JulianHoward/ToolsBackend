const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");
module.exports = app => {
    const controller = require("../controllers/contrato.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listContrato);
    router.get("/:id", checkUserMiddleware, controller.getContrato);
    router.get("/cliente/:clienteFK", checkUserMiddleware, controller.getContratoByCliente);
    router.get("/servicio/:servicioFK", checkUserMiddleware, controller.getContratoByServicio);
    router.post("/", checkUserMiddleware, controller.createContrato);
    router.put("/:id", checkUserMiddleware, controller.updateContrato);
    router.patch("/:id", checkUserMiddleware, controller.updateContrato);
    router.delete("/:id", checkUserMiddleware, controller.deleteContrato);

    app.use("/api/contratos", router);
}
