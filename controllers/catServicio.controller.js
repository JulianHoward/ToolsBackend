const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listCategoriasServicios = async (req, res) => {
    try {
        const categoriasServicios = await db.catServicios.findAll();
        res.send(categoriasServicios);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getCategoriasServicios = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriaServicio = await db.catServicios.findByPk(id);
        if (!categoriaServicio) {
            res.status(404).send({ message: "Categoría no encontrada" });
            return;
        }
        res.send(categoriaServicio);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createCategoriaServicio = async (req, res) => {
    const requiredFields = ["nombre", "descripcion"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const categoriaServicio = await db.catServicios.create(req.body);
        res.send(categoriaServicio);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateCategoriaServicio = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriaServicio = await db.catServicios.findByPk(id);
        if (!categoriaServicio) {
            res.status(404).send({ message: "Categoría no encontrada" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre", "descripcion"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
                        ", "
                    )}`,
                });
                return;
            }
            await categoriaServicio.update(req.body);
            res.send(categoriaServicio);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteCategoriaServicio = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriaServicio = await db.catServicios.findByPk(id);
        if (!categoriaServicio) {
            res.status(404).send({ message: "Categoría no encontrada" });
            return;
        }
        await categoriaServicio.destroy();
        res.send({ message: "Categoría eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
