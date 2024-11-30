const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.usuarioAuths = require("./usuarioAuth.model.js")(sequelize, Sequelize);
db.alquileres = require("./alquiler.model.js")(sequelize, Sequelize);
db.calificaciones = require("./calificacion.model.js")(sequelize, Sequelize);
db.catHerramientas = require("./catHerramienta.model.js")(sequelize, Sequelize);
db.catServicios = require("./catServicio.model.js")(sequelize, Sequelize);
db.contratos = require("./contrato.model.js")(sequelize, Sequelize);
db.pagos = require("./pago.model.js")(sequelize, Sequelize);
db.productos = require("./producto.model.js")(sequelize, Sequelize);
db.servicios = require("./servicio.model.js")(sequelize, Sequelize);

// Relaciones

// Relación entre usuarios y tokens de usuario
db.usuarios.hasMany(db.usuarioAuths, { as: "tokens", foreignKey: "usuario_id" });
db.usuarioAuths.belongsTo(db.usuarios, { foreignKey: "usuario_id", as: "usuario" });

// Relación entre productos y categorías de herramientas
db.productos.belongsTo(db.catHerramientas, { foreignKey: "categoriaHerramientaFK", as: "categoriaHerramienta" });
db.catHerramientas.hasMany(db.productos, { foreignKey: "categoriaHerramientaFK", as: "productos" });

// Relación entre productos y proveedores
db.productos.belongsTo(db.usuarios, { foreignKey: "proveedorFK", as: "proveedor" });
db.usuarios.hasMany(db.productos, { foreignKey: "proveedorFK", as: "productos" });

// Relación entre servicios y categorías de servicios
db.servicios.belongsTo(db.catServicios, { foreignKey: "categoriaServicioFK", as: "categoriaServicio" });
db.catServicios.hasMany(db.servicios, { foreignKey: "categoriaServicioFK", as: "servicios" });

// Relación entre servicios y proveedores
db.servicios.belongsTo(db.usuarios, { foreignKey: "proveedorFK", as: "proveedor" });
db.usuarios.hasMany(db.servicios, { foreignKey: "proveedorFK", as: "servicios" });

// Relación entre alquileres y productos
db.alquileres.belongsTo(db.productos, { foreignKey: "productoFK", as: "producto" });
db.productos.hasMany(db.alquileres, { foreignKey: "productoFK", as: "alquileres" });

// Relación entre alquileres y usuarios
db.alquileres.belongsTo(db.usuarios, { foreignKey: "clienteFK", as: "usuario" });
db.usuarios.hasMany(db.alquileres, { foreignKey: "clienteFK", as: "alquileres" });

// Relación entre calificaciones, productos y servicios
db.calificaciones.belongsTo(db.productos, { foreignKey: "productoFK", as: "producto" });
db.calificaciones.belongsTo(db.servicios, { foreignKey: "servicioFK", as: "servicio" });
db.productos.hasMany(db.calificaciones, { foreignKey: "productoFK", as: "calificacionesProducto" });
db.servicios.hasMany(db.calificaciones, { foreignKey: "servicioFK", as: "calificacionesServicio" });

// Relación entre calificaciones y usuarios
db.calificaciones.belongsTo(db.usuarios, { foreignKey: "usuarioFK", as: "usuario" });
db.usuarios.hasMany(db.calificaciones, { foreignKey: "usuarioFK", as: "calificaciones" });

// Relación entre contratos y servicios
db.contratos.belongsTo(db.servicios, { foreignKey: "servicioFK", as: "servicio" });
db.servicios.hasMany(db.contratos, { foreignKey: "servicioFK", as: "contratos" });

// Relación entre contratos y usuarios
db.contratos.belongsTo(db.usuarios, { foreignKey: "clienteFK", as: "cliente" });
db.usuarios.hasMany(db.contratos, { foreignKey: "clienteFK", as: "contratos" });

// Relación entre pagos y clientes (usuarios)
db.pagos.belongsTo(db.usuarios, { foreignKey: "clienteFK", as: "cliente" });
db.usuarios.hasMany(db.pagos, { foreignKey: "clienteFK", as: "pagos" });

module.exports = db;
