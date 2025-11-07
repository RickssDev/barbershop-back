/**
 * Conexión a la base de datos mysql2.
 * 
 * Aquí configuramos y establecemos la conexión con la base de datos,
 * además de mostrar un mensaje de error en caso de fallar en la conexión.
 * 
 */
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "ricardo",
    password: "12345",
    database: "barber"
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});

module.exports = db;
