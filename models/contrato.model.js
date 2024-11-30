module.exports = (sequelize, Sequelize) => {
    const Contrato = sequelize.define("contrato", {
        clienteFK: {
            type: Sequelize.INTEGER
        },
        servicioFK: {
            type: Sequelize.INTEGER
        },
        fechaInicio: {
            type: Sequelize.DATE
        },
        duracion: {
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.DECIMAL
        },
        estado: {
            type: Sequelize.DataTypes.ENUM('pendiente', 'en progreso', 'completado', 'cancelado'),
            defaultValue: 'pendiente'
        },
    });
    return Contrato;
}