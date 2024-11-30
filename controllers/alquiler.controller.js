const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listAlquiler = async (req, res) => {
    try {
        const alquileres = await db.alquileres.findAll();
        res.send(alquileres);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los alquileres",
        });
    }
}

exports.getAlquiler = async (req, res) => {
    const id = req.params.id;
    try {
        const alquiler = await db.alquileres.findByPk(id);
        if (!alquiler) {
            res.status(404).send({ message: "Alquiler no encontrado" });
            return;
        }
        res.send(alquiler);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el alquiler",
        });
    }
}

exports.getAlquilerByCliente = async (req, res) => {
    const clienteFK = req.params.clienteFK;

    db.alquileres.findAll({ where: { clienteFK: clienteFK } })
        .then(alquileres => {
            res.status(200).send(alquileres);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los alquileres",
            });
        });
}

exports.getAlquilerByProducto = async (req, res) => {
    const productoFK = req.params.productoFK;

    db.alquileres.findAll({ where: { productoFK: productoFK } })
        .then(alquileres => {
            res.status(200).send(alquileres);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los alquileres",
            });
        });
}

exports.createAlquiler = async (req, res) => {
    const requiredFields = ["clienteFK", "productoFK", "fechaInicio", "fechaFin", "total", "estado"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const validEstados = ["pendiente", "en progreso", "completado", "cancelado"];
        if (!validEstados.includes(req.body.estado)) {
            return res.status(400).send({
                message: `El estado no es válido. Estados permitidos: ${validEstados.join(", ")}`,
            });
        }
        const nuevoAlquiler = {
            clienteFK: req.body.clienteFK,
            productoFK: req.body.productoFK,
            fechaInicio: req.body.fechaInicio,
            fechaFin: req.body.fechaFin,
            total: req.body.total,
            estado: "pendiente",
        };

        const alquiler = await db.alquileres.create(nuevoAlquiler);
        res.status(200).send(alquiler);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al crear el alquiler",
        });
    }
}

exports.updateAlquiler = async (req, res) => {
    const { id } = req.params;

    try {
        const alquiler = await db.alquileres.findByPk(id);
        if (!alquiler) {
            return res.status(404).send({ message: "El alquiler no existe." });
        }

        if (req.method === "PUT") {
            const validEstados = ["pendiente", "en progreso", "completado", "cancelado"];

            if (req.body.estado && !validEstados.includes(req.body.estado)) {
                return res.status(400).send({
                    message: `Estado no válido. Estados permitidos: ${validEstados.join(", ")}`,
                });
            }

            await db.alquileres.update(req.body, {
                where: { id: id },
            });

            res.status(200).send({
                message: "El alquiler ha sido actualizado exitosamente.",
                data: { id, ...req.body },
            });
        } else {
            res.status(405).send({ message: "Método no permitido" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al actualizar el alquiler.",
        });
    }
}

exports.deleteAlquiler = async (req, res) => {
    const id = req.params.id;
    try {
        await db.alquileres.destroy({
            where: { id: id }
        });
        res.status(200).send({ message: "Alquiler eliminado" });
    } catch (error) {
        res.status(500).send({
            message: "Error al eliminar el alquiler",
        });
    }
}
