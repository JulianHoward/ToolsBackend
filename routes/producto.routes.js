const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/producto.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listProductos);
    router.get("/:id", checkUserMiddleware, controller.getProducto);
    router.get("/categoria/:categoriaFK", checkUserMiddleware, controller.getProductosByCategoria);
    router.get("/proveedor/:proveedorFK", checkUserMiddleware, controller.getProductosByProveedor);
    router.post("/", checkUserMiddleware, controller.createProducto);
    router.put("/:id", checkUserMiddleware, controller.updateProducto);
    router.patch("/:id", checkUserMiddleware, controller.updateProducto);
    router.delete("/:id", checkUserMiddleware, controller.deleteProducto);
    router.post("/:id/image", checkUserMiddleware, controller.uploadImage);

    app.use("/api/productos", router);
}
