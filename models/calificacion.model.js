module.exports = (sequelize, Sequelize) => {
    const Calificacion = sequelize.define("calificacion", {
        usuarioFK: {
            type: Sequelize.INTEGER
        },
        productoFK: {
            type: Sequelize.INTEGER
        },
        servicioFK: {
            type: Sequelize.INTEGER
        },
        puntuacion: {
            type: Sequelize.INTEGER
        },
        comentario: {
            type: Sequelize.STRING
        }
    });
    return Calificacion;
}