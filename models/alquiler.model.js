module.exports = (sequelize, Sequelize) => {
    const Alquiler = sequelize.define("alquiler", {
        clienteFK: {
            type: Sequelize.INTEGER
        },
        productoFK: {
            type: Sequelize.INTEGER
        },
        fechaInicio: {
            type: Sequelize.DATE
        },
        fechaFin: {
            type: Sequelize.DATE
        },
        total: {
            type: Sequelize.DECIMAL
        },
        estado: {
            type: Sequelize.DataTypes.ENUM('pendiente', 'en progreso', 'completado', 'cancelado'),
            defaultValue: 'pendiente'
        },
    });
    return Alquiler;
}