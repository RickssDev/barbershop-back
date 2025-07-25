const db = require("./src/models/db");

db.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) {
        console.error("Error en consulta:", err);
        process.exit(1);
    }
    console.log("Resultado de prueba:", results[0].solution); // Debe mostrar 2
    process.exit(0);
});
