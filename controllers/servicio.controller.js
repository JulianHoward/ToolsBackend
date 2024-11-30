const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");

exports.listServicios = async (req, res) => {
    try {
        const servicios = await db.servicios.findAll();
        res.send(servicios);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los servicios",
        });
    }
}

exports.getServicio = async (req, res) => {
    const id = req.params.id;
    try {
        const servicio = await db.servicios.findByPk(id);
        if (!servicio) {
            res.status(404).send({ message: "Servicio no encontrado" });
            return;
        }
        res.send(servicio);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el servicio",
        });
    }
}

exports.getServiciosByCategoria = async (req, res) => {
    const categoriaFK = req.params.categoriaFK;

    db.servicios.findAll({ where: { categoriaServicioFK: categoriaFK } })
        .then(servicios => {
            res.status(200).send(servicios);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los servicios",
            });
        });
}

exports.getServiciosByProveedor = async (req, res) => {
    const proveedorFK = req.params.proveedorFK;

    db.servicios.findAll({ where: { proveedorFK: proveedorFK } })
        .then(servicios => {
            res.status(200).send(servicios);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los servicios",
            });
        });
}

exports.createServicio = async (req, res) => {
    const requiredFields = ["nombre", "descripcion", "categoriaServicioFK", "precio", "proveedorFK"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const servicio = await db.servicios.create(req.body);
        res.send(servicio);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear el servicio",
        });
    }
}

exports.updateServicio = async (req, res) => {
    const id = req.params.id;
    try {
        const servicio = await db.servicios.findByPk(id);
        if (!servicio) {
            res.status(404).send({ message: "Servicio no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre", "descripcion", "categoriaServicioFK", "precio", "proveedorFK"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
                        ", "
                    )}`,
                });
                return;
            }
            await db.servicios.update(req.body, {
                where: { id: id },
            });
            res.send(servicio);
        }
    }
    catch (error) {
        res.status(500).send({
            message: "Error al actualizar el servicio",
        });
    }
}

exports.deleteServicio = async (req, res) => {
    const id = req.params.id;
    try {
        const servicio = await db.servicios.findByPk(id);
        if (!servicio) {
            res.status(404).send({ message: "Servicio no encontrado" });
            return;
        }
        await db.servicios.destroy({
            where: { id: id },
        });
        res.send({ message: "Servicio eliminado" });
    } catch (error) {
        res.status(500).send({
            message: "Error al eliminar el servicio",
        });
    }
}

exports.getImage = async (req, res) => {
    const id = req.params.id;
    try {
        const servicio = await db.servicios.findByPk(id);
        if (!servicio) {
            res.status(404).send({ message: "Servicio no encontrado" });
            return;
        }
        if(!servicio.imagen) {
            res.status(404).send({ message: "Foto no encontrada" });
            return;
        }
        res.sendFile(servicio.imagen);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.uploadImage = async (req, res) => {
    const id = req.params.id;
    try {
        const servicio = await db.servicios.findByPk(id);
        if (!servicio) {
            res.status(404).send({ message: "Servicio no encontrado" });
            return;
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './public/images/servicios');
            },
            filename: function (req, file, cb) {
                cb(null, req.params.id + '.jpg');
            }
        });
        const upload = multer({ storage: storage }).single('imagen');
        upload(req, res, async function (err) {
            if (err) {
                res.status(500).send({ message: "Error al subir la foto" });
                return;
            }
            await db.servicios.update({ imagen: req.file.path }, { 
                where: { id: id }
            });
            res.send({ message: "Foto subida" });
        });
    } catch (error) {
        sendError500(res, error);
    }
}
