const db = require("../models");
const { checkRequiredFields } = require("../utils/request.utils");
const stripe = require('stripe')("sk_test_51QP91GLLzagkDKpS7wQz3ETsX6gi1869fD3xDdMKRTZSBMfI3QtqUYRdgRA1LiPfWZGP99KDaY3efaGeK1UrshIZ00CPLo8nll");


exports.listPagos = async (req, res) => {
    try {
        const pagos = await db.pagos.findAll();
        res.send(pagos);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener los pagos",
        });
    }
}

exports.getPago = async (req, res) => {
    const id = req.params.id;
    try {
        const pago = await db.pagos.findByPk(id);
        if (!pago) {
            res.status(404).send({ message: "Pago no encontrado" });
            return;
        }
        res.send(pago);
    } catch (error) {
        res.status(500).send({
            message: "Error al obtener el pago",
        });
    }
}

exports.getPagoByCliente = async (req, res) => {
    const clienteFK = req.params.clienteFK;

    db.pagos.findAll({ where: { clienteFK: clienteFK } })
        .then(pagos => {
            res.status(200).send(pagos);
        })
        .catch(error => {
            res.status(500).send({
                message: "Error al obtener los pagos",
            });
        });
}

exports.createPago = async (req, res) => {
    const requiredFields = ["clienteFK", "metodo", "total"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`,
        });
        return;
    }
    try {
        const validMetodos = ["QR", "efectivo", "tarjeta"];
        if (!validMetodos.includes(req.body.metodo)) {
            return res.status(400).send({
                message: `El método de pago no es válido. Métodos permitidos: ${validMetodos.join(", ")}`,
            });
        }
        const nuevoPago = {
            clienteFK: req.body.clienteFK,
            metodo: req.body.metodo,
            total: req.body.total,
            estado: "pendiente",
        };

        const pago = await db.pagos.create(nuevoPago);
        res.status(200).send(pago);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al crear el pago",
        });
    }
}

exports.updatePago = async (req, res) => {
    const { id } = req.params;

    try {
        const pago = await db.pagos.findByPk(id);
        if (!pago) {
            return res.status(404).send({ message: "El pago no existe." });
        }

        if (req.method === "PUT") {
            const validMetodos = ["QR", "efectivo", "tarjeta"];
            const validEstados = ["pendiente", "completado", "fallido"];

            if (req.body.metodo && !validMetodos.includes(req.body.metodo)) {
                return res.status(400).send({
                    message: `Método de pago no válido. Métodos permitidos: ${validMetodos.join(", ")}`,
                });
            }

            if (req.body.estado && !validEstados.includes(req.body.estado)) {
                return res.status(400).send({
                    message: `Estado no válido. Estados permitidos: ${validEstados.join(", ")}`,
                });
            }

            await db.pagos.update(req.body, {
                where: { id: id },
            });

            res.status(200).send({
                message: "El pago ha sido actualizado exitosamente.",
                data: { id, ...req.body },
            });
        } else {
            res.status(405).send({ message: "Método no permitido" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Error al actualizar el pago.",
        });
    }
};

exports.deletePago = async (req, res) => {
    const id = req.params.id;
    try {
        const pago = await db.pagos.findByPk(id);
        if (!pago) {
            res.status(404).send({ message: "Pago no encontrado" });
            return;
        }
        await db.pagos.destroy({
            where: { id: id },
        });
        res.send({ message: "Pago eliminado" });
    } catch (error) {
        res.status(500).send({
            message: "Error al eliminar el pago",
        });
    }
}

exports.createStripeSession = async (req, res) => {
    const { carrito, total, clienteFK } = req.body;

    console.log("Carrito recibido:", carrito); // Verificar los datos del carrito

    if (!carrito || carrito.length === 0) {
        return res.status(400).send({ message: "El carrito está vacío." });
    }

    // Verificar que la cantidad de todos los productos sea mayor que 0
    if (!carrito.every(item => item.quantity > 0)) {
        return res.status(400).send({ message: "Todos los productos deben tener una cantidad mayor a 0." });
    }

    try {
        // Crear la sesión de Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: carrito.map((item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.nombre,
                        description: item.descripcion || 'Producto',
                    },
                    unit_amount: Math.round(item.precio * 100), // Convertir a centavos
                },
                quantity: item.quantity,
            })),
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel`,
        });

        // Registrar el pago como pendiente en la base de datos
        const nuevoPago = await db.pagos.create({
            clienteFK,
            metodo: 'tarjeta',
            total,
            estado: 'pendiente',
        });

        // Devolver la URL de Stripe y el ID del pago
        res.status(200).send({ url: session.url, pagoId: nuevoPago.id });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error al crear la sesión de pago con Stripe." });
    }
};

