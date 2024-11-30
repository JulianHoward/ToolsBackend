module.exports = (sequelize, Sequelize) => {
    const Servicio = sequelize.define("servicio", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        categoriaServicioFK: {
            type: Sequelize.INTEGER
        },
        precio: {
            type: Sequelize.DECIMAL
        },
        proveedorFK: {
            type: Sequelize.INTEGER
        },
        imagen: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/services/${this.id}.jpg`;
            }
        },
    });
    return Servicio;
}