module.exports = {
    HOST: process.env.MYSQLHOST || "localhost",
    USER: process.env.MYSQLUSER || "root",
    PASSWORD: process.env.MYSQLPASSWORD || "root",
    DB: process.env.MYSQL_DATABASE || "tools",
    dialect: "mysql",
}
// changing db