module.exports = (sequelize, Sequelize) => {
    const CatServicio = sequelize.define("catServicio", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
    });
    return CatServicio;
}