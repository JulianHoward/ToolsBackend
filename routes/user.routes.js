const { checkUserMiddleware } = require("../middlewares/check-user.middleware.js");

module.exports = app => {
    const controller = require("../controllers/user.controller.js")
    let router = require("express").Router();

    router.get("/", checkUserMiddleware, controller.listUsers);
    router.get("/:id", checkUserMiddleware, controller.getUser);
    router.post("/", checkUserMiddleware, controller.createUser);
    router.put("/:id", checkUserMiddleware, controller.updateUser);
    router.patch("/:id", checkUserMiddleware, controller.updateUser);
    router.delete("/:id", checkUserMiddleware, controller.deleteUser);
    router.post("/:id/profilePic", checkUserMiddleware, controller.uploadProfilePic);

    app.use("/api/users", router);
}
