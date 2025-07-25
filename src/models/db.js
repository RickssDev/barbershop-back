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
