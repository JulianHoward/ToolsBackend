const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listContrato = async (req, res) => {
    try {
        const contratos = await db.contratos.findAll();
        res.send(contratos);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los contratos",
        });
    }
}

exports.getContrato = async (req, res) => {
    const id = req.params.id;
    try {
        const contrato = await db.contratos.findByPk(id);
        if (!contrato) {
            res.status(404).send({ message: "Contrato no encontrado" });
            return;
        }
        res.send(contrato);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el contrato",
        });
    }
}

exports.getContratoByCliente = async (req, res) => {
    const clienteFK = req.params.clienteFK;

    db.contratos.findAll({ where: { clienteFK: clienteFK } })
        .then(contratos => {
            res.status(200).send(contratos);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los contratos",
            });
        });
}

exports.getContratoByServicio = async (req, res) => {
    const servicioFK = req.params.servicioFK;

    db.contratos.findAll({ where: { servicioFK: servicioFK } })
        .then(contratos => {
            res.status(200).send(contratos);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los contratos",
            });
        });
}

exports.createContrato = async (req, res) => {
    const requiredFields = ["clienteFK", "servicioFK", "fechaInicio", "duracion", "total", "estado"];
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
        const nuevoContrato = {
            clienteFK: req.body.clienteFK,
            servicioFK: req.body.servicioFK,
            fechaInicio: req.body.fechaInicio,
            duracion: req.body.duracion,
            total: req.body.total,
            estado: "pendiente",
        };

        const contrato = await db.contratos.create(nuevoContrato);
        res.status(200).send(contrato);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al crear el contrato",
        });
    }
}

exports.updateContrato = async (req, res) => {
    const { id } = req.params;

    try {
        const contrato = await db.contratos.findByPk(id);
        if (!contrato) {
            return res.status(404).send({ message: "El contrato no existe." });
        }

        if (req.method === "PUT") {
            const validEstados = ["pendiente", "en progreso", "completado", "cancelado"];

            if (req.body.estado && !validEstados.includes(req.body.estado)) {
                return res.status(400).send({
                    message: `Estado no válido. Estados permitidos: ${validEstados.join(", ")}`,
                });
            }

            await db.contratos.update(req.body, {
                where: { id: id },
            });

            res.status(200).send({
                message: "El contrato ha sido actualizado exitosamente.",
                data: { id, ...req.body },
            });
        } else {
            res.status(405).send({ message: "Método no permitido" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al actualizar el contrato.",
        });
    }
};

exports.deleteContrato = async (req, res) => {
    const { id } = req.params;

    try {
        const contrato = await db.contratos.findByPk(id);
        if (!contrato) {
            return res.status(404).send({ message: "El contrato no existe." });
        }

        await db.contratos.destroy({
            where: { id: id },
        });

        res.status(200).send({ message: "El contrato ha sido eliminado exitosamente." });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al eliminar el contrato.",
        });
    }
};