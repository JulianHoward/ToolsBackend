module.exports = (sequelize, Sequelize) => {
    const CatHerramienta = sequelize.define("catHerramienta", {
        nombre: {
            type: Sequelize.STRING
        },
        descripcion: {
            type: Sequelize.STRING
        },
    });
    return CatHerramienta;
}