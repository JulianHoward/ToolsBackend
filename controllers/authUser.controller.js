const db = require("../models");
const { generarTokenUsuario } = require("../utils/code.utils");
const { stringToSha1 } = require("../utils/crypto.utils");
const { checkRequiredFields } = require("../utils/request.utils");

exports.generateUserToken = async (req, res) => {
    const requiredFields = ["correo", "password"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    const { correo, password } = req.body;

    console.log("Correo:", correo);
    console.log("Password (raw):", password);
    console.log("Password (hashed):", stringToSha1(password));

    const usuario = await db.usuarios.findOne({
        where: {
            correo: correo,
            password: stringToSha1(password)
        }
    });

    if (!usuario) {
        res.status(401).send({ message: "Usuario o contraseña incorrectos" });
        return;
    }

    const token = generarTokenUsuario();
    await db.usuarioAuths.create({
        token,
        usuario_id: usuario.id
    });
    res.send({ token });
}

exports.registerUser = async (req, res) => {
    const requiredFields = ["nombre", "apellido", "correo", "password", "telefono", "direccion"];
    const fieldsWithErrors = checkRequiredFields(requiredFields, req.body);
    if (fieldsWithErrors.length > 0) {
        res.status(400).send({
            message: `Faltan los siguientes campos: ${fieldsWithErrors.join(", ")}`
        });
        return;
    }
    const { nombre, apellido, correo, password, telefono, direccion } = req.body;
    const usuarioDB = await db.usuarios.findOne({
        where: {
            correo
        }
    });
    if (usuarioDB) {
        res.status(400).send({ message: "El correo ya está registrado" });
        return;
    }
    const usuario = await db.usuarios.create({
        nombre,
        apellido,
        correo,
        password: stringToSha1(password),
        telefono,
        direccion
    });
    usuario.password = undefined;
    res.send(usuario);
}

exports.meUser = async (req, res) => {
    console.log("user actual", res.locals.user)
    const persona = await db.usuarios.findOne({
        where: {
            id: res.locals.user.id
        }
    });
    res.send(persona);
}
