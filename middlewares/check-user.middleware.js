const db = require("../models");

exports.checkUserMiddleware = async (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) {
        return res.status(401).send({ message: "No autorizado" });
    }
    
    const cleanToken = tokenHeader.startsWith("Bearer ") ? tokenHeader.slice(7, tokenHeader.length) : tokenHeader;
    
    try {
        // Verificar el token en la tabla de usuarios
        let authRecord = await db.usuarioAuths.findOne({
            where: {
                token: cleanToken
            }
        });

        if (authRecord) {
            const user = await db.usuarios.findOne({
                where: {
                    id: authRecord.usuario_id
                }
            });
            
            if (user) {
                console.log("middleware user", user.correo);
                res.locals.user = user;
                return next();
            }
        }

        // Verificar el token en la tabla de admins
        authRecord = await db.adminAuths.findOne({
            where: {
                token: cleanToken
            }
        });

        if (authRecord) {
            const admin = await db.admins.findOne({
                where: {
                    id: authRecord.admin_id
                }
            });
            
            if (admin) {
                console.log("middleware admin", admin.correo);
                res.locals.admin = admin;
                return next();
            }
        }

        return res.status(401).send({ message: "Token inválido o no encontrado" });

    } catch (error) {
        console.error("Error en el middleware de verificación de usuario:", error);
        res.status(500).send({ message: "Error interno del servidor" });
    }
}