const db = require("../models");
const { checkRequiredFields, sendError500 } = require("../utils/request.utils");
const { upload } = require('../index');
const path = require('path');


exports.listProductos = async (req, res) => {
    try {
        const productos = await db.productos.findAll();
        res.send(productos);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los productos",
        });
    }
}

exports.getProducto = async (req, res) => {
    const id = req.params.id;
    try {
        const producto = await db.productos.findByPk(id);
        if (!producto) {
            res.status(404).send({ message: "Producto no encontrado" });
            return;
        }
        res.send(producto);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el producto",
        });
    }
}

exports.getProductosByCategoria = async (req, res) => {
    const categoriaFK = req.params.categoriaFK;

    db.productos.findAll({ where: { categoriaHerramientaFK: categoriaFK } })
        .then(productos => {
            res.status(200).send(productos);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los productos",
            });
        });
}

exports.getProductosByProveedor = async (req, res) => {
    const proveedorFK = req.params.proveedorFK;

    db.productos.findAll({ where: { proveedorFK: proveedorFK } })
        .then(productos => {
            res.status(200).send(productos);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los productos",
            });
        });
}

exports.createProducto = async (req, res) => {
    const requiredFields = ["nombre", "descripcion", "categoriaHerramientaFK", "precio", "stock", "proveedorFK"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const producto = await db.productos.create(req.body);
        res.send(producto);
    } catch (error) {
        res.status(500).send({
            message: "Error al crear el producto",
        });
    }
}

exports.updateProducto = async (req, res) => {
    const id = req.params.id;
    try {
        const producto = await db.productos.findByPk(id);
        if (!producto) {
            res.status(404).send({ message: "Producto no encontrado" });
            return;
        }
        if (req.method === "PUT") {
            const requiredFields = ["nombre", "descripcion", "categoriaHerramientaFK", "precio", "stock", "proveedorFK"];
            const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
            if (fieldsWithErrors.length > 0) {
                res.status(400).send({
                    message: `Faltan los siguientes campos: ${fieldsWithErrors.join(
                        ", "
                    )}`,
                });
                return;
            }
            await db.productos.update(req.body, {
                where: { id: id },
            });
            res.send(producto);
        }
    }
    catch (error) {
        res.status(500).send({
            message: "Error al actualizar el producto",
        });
    }
}

exports.deleteProducto = async (req, res) => {
    const id = req.params.id;
    try {
        const producto = await db.productos.findByPk(id);
        if (!producto) {
            res.status(404).send({ message: "Producto no encontrado" });
            return;
        }
        await db.productos.destroy({
            where: { id: id },
        });
        res.send({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).send({
            message: "Error al eliminar el producto",
        });
    }
}

exports.getImage = async (req, res) => {
    const id = req.params.id;
    try {
        const producto = await db.productos.findByPk(id);
        if (!producto) {
            res.status(404).send({ message: "Producto no encontrado" });
            return;
        }
        if(!producto.imagen) {
            res.status(404).send({ message: "Foto no encontrada" });
            return;
        }
        res.sendFile(producto.imagen);
    } catch (error) {
        sendError500(res, error);
    }
}

exports.uploadImage = async (req, res) => {
    const id = req.params.id;
    try {
        const producto = await db.productos.findByPk(id);
        if (!producto) {
            return res.status(404).send({ message: "Producto no encontrado" });
        }

        // Middleware para subir la imagen
        upload.single('imagen')(req, res, async function (err) {
            if (err) {
                return res.status(500).send({ message: "Error al subir la imagen", error: err.message });
            }

            // Construir la URL pública que será accesible desde el frontend
            const imageUrl = `http://localhost:3000/images/productos/${req.file.filename}`;

            // Actualizar la base de datos con la URL de la imagen
            await db.productos.update({ imagen: imageUrl }, { where: { id: id } });

            res.send({ message: "Imagen subida con éxito", url: imageUrl });
        });
    } catch (error) {
        sendError500(res, error);
    }
};


