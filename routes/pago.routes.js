const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/pago.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listPagos);
    router.get("/:id", checkUserMiddleware, controller.getPago);
    router.get("/cliente/:clienteFK", checkUserMiddleware, controller.getPagoByCliente);
    router.post("/", checkUserMiddleware, controller.createPago);
    router.put("/:id", checkUserMiddleware, controller.updatePago);
    router.patch("/:id", checkUserMiddleware, controller.updatePago);
    router.delete("/:id", checkUserMiddleware, controller.deletePago);

    router.post('/create-stripe-session', controller.createStripeSession);

    app.use("/api/pagos", router);
}