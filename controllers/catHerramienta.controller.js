const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");

exports.listCategoriasHerramientas = async (req, res) => {
    try {
        const categoriasHerramientas = await db.catHerramientas.findAll();
        res.send(categoriasHerramientas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.getCategoriasHerramientas = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriasHerramientas = await db.catHerramientas.findByPk(id);
        if (!categoriasHerramientas) {
            res.status(404).send({ message: "Herramienta no encontrada" });
            return;
        }
        res.send(categoriasHerramientas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.createCategoriaHerramienta = async (req, res) => {
    const requiredFields = ["nombre", "descripcion"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const categoriasHerramientas = await db.catHerramientas.create(req.body);
        res.send(categoriasHerramientas);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.updateCategoriaHerramienta = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriasHerramientas = await db.catHerramientas.findByPk(id);
        if (!categoriasHerramientas) {
            res.status(404).send({ message: "Herramienta no encontrada" });
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
            await categoriasHerramientas.update(req.body);
            res.send(categoriasHerramientas);
        }
    } catch (error) {
        sendError500(res, error);
    }
}

exports.deleteCategoriaHerramienta = async (req, res) => {
    const id = req.params.id;
    try {
        const categoriasHerramientas = await db.catHerramientas.findByPk(id);
        if (!categoriasHerramientas) {
            res.status(404).send({ message: "Herramienta no encontrada" });
            return;
        }
        await categoriasHerramientas.destroy();
        res.send({ message: "Herramienta eliminada" });
    } catch (error) {
        sendError500(res, error);
    }
}
