const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listCalificacion = async (req, res) => {
    try {
        const calificaciones = await db.calificaciones.findAll();
        res.send(calificaciones);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener las calificaciones",
        });
    }
}

exports.getCalificacion = async (req, res) => {
    const id = req.params.id;
    try {
        const calificacion = await db.calificaciones.findByPk(id);
        if (!calificacion) {
            res.status(404).send({ message: "Calificacion no encontrada" });
            return;
        }
        res.send(calificacion);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener la calificacion",
        });
    }
}

exports.getCalificacionByUsuario = async (req, res) => {
    const usuarioFK = req.params.usuarioFK;

    db.calificaciones.findAll({ where: { usuarioFK: usuarioFK } })
        .then(calificaciones => {
            res.status(200).send(calificaciones);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener las calificaciones",
            });
        });
}

exports.getCalificacionByProducto = async (req, res) => {
    const productoFK = req.params.productoFK;

    db.calificaciones.findAll({ where: { productoFK: productoFK } })
        .then(calificaciones => {
            res.status(200).send(calificaciones);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener las calificaciones",
            });
        });
}

exports.getCalificacionByServicio = async (req, res) => {
    const servicioFK = req.params.servicioFK;

    db.calificaciones.findAll({ where: { servicioFK: servicioFK } })
        .then(calificaciones => {
            res.status(200).send(calificaciones);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener las calificaciones",
            });
        });
}

exports.createCalificacion = async (req, res) => {
    const { usuarioFK, productoFK, servicioFK, puntuacion, comentario } = req.body;

    if (!usuarioFK || !puntuacion || !comentario) {
        return res.status(400).send({
            message: "Faltan campos obligatorios: usuarioFK, puntuacion o comentario.",
        });
    }

    
    if (!productoFK && !servicioFK) {
        return res.status(400).send({
            message: "Debes calificar un producto o un servicio.",
        });
    }

    
    if (productoFK && servicioFK) {
        return res.status(400).send({
            message: "Solo puedes calificar un producto o un servicio, no ambos.",
        });
    }

    try {
        const calificacion = await db.calificaciones.create(req.body);
        res.status(201).send(calificacion);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al crear la calificación.",
        });
    }
}

exports.updateCalificacion = async (req, res) => {
    const { id } = req.params;
    const { productoFK, servicioFK, puntuacion, comentario } = req.body;

    try {
        const calificacion = await db.calificaciones.findByPk(id);
        if (!calificacion) {
            return res.status(404).send({
                message: "Calificación no encontrada.",
            });
        }

        if (!productoFK && !servicioFK) {
            return res.status(400).send({
                message: "Debes asociar la calificación a un producto o un servicio.",
            });
        }

        if (productoFK && servicioFK) {
            return res.status(400).send({
                message: "Solo puedes asociar la calificación a un producto o un servicio, no ambos.",
            });
        }

        if (puntuacion && (puntuacion < 1 || puntuacion > 5)) {
            return res.status(400).send({
                message: "La puntuación debe estar entre 1 y 5.",
            });
        }

        if (!comentario) {
            return res.status(400).send({
                message: "El comentario es obligatorio.",
            });
        }

        await db.calificaciones.update(req.body, {
            where: { id },
        });

        res.status(200).send({
            message: "Calificación actualizada correctamente.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al actualizar la calificación.",
        });
    }
}

exports.deleteCalificacion = async (req, res) => {
    const { id } = req.params;

    try {
        const calificacion = await db.calificaciones.findByPk(id);
        if (!calificacion) {
            return res.status(404).send({
                message: "Calificación no encontrada.",
            });
        }

        await db.calificaciones.destroy({
            where: { id },
        });

        res.status(200).send({
            message: "Calificación eliminada correctamente.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al eliminar la calificación.",
        });
    }
}