module.exports = (sequelize, Sequelize) => {
    const Pago = sequelize.define("pago", {
        clienteFK: {
            type: Sequelize.INTEGER
        },
        metodo: {
            type: Sequelize.DataTypes.ENUM('QR', 'efectivo', 'tarjeta'),
            defaultValue: 'efectivo'
        },
        total: {
            type: Sequelize.DECIMAL
        },
        estado: {
            type: Sequelize.DataTypes.ENUM('pendiente', 'completado', 'fallido'),
            defaultValue: 'pendiente'
        },
    });
    return Pago;
}