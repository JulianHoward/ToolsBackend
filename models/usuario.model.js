module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define("usuario", {
        nombre: {
            type: Sequelize.STRING
        },
        apellido: {
            type: Sequelize.STRING
        },
        correo: {
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        telefono: {
            type: Sequelize.STRING
        },
        direccion: {
            type: Sequelize.STRING
        },
        profilePic: {
            type: Sequelize.VIRTUAL,
            get: function () {
                return `http://localhost:3000/images/profiles/${this.id}.jpg`;
            }
        },
    });
    return Usuario;
}