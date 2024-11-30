module.exports = (sequelize, Sequelize) => {
    const Producto = sequelize.define("producto", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
        categoriaHerramientaFK: {
            type: Sequelize.INTEGER
        },
        precio: {
            type: Sequelize.DECIMAL
        },
        stock: {
            type: Sequelize.INTEGER
        },
        proveedorFK: {
            type: Sequelize.INTEGER
        },
        imagen: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/productos/${this.id}.jpg`;
            }
        },
    });
    return Producto;
}