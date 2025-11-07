/**
 * Controlador del dashboard del admin.
 * 
 * Este módulo gestiona las operaciones relacionadas con el administrador. Utilizando así:
 * gráficos de carga de totales y visitas diarias/mensuales.
 * 
 * @dependencies
 * - db: conexión a la base de datos MySQL.
 * 
 * Funciones exportadas:
 * - geTotales: llama todas las funciones de la carga de servicios y las muestra.
 * - getVisitas: obtiene las visitas almacenadas en la tabla y los devuelve de ascendente.
 * - registrarVisitas: verifica si ya existe un registro, en caso de:
 * si: incrementa el contador "total" en 1, no: crea un nuevo registro "total" = 1.
 * - getVisitasMensuales: suma el "total" de cada día para obtener el total mensual, 
 * posteriormente los resultados se devuelven en orden ascendente.
 */
const { getTotalCortesValue } = require("./cortesController");
const { getTotalReservasValue } = require("./reservaController");
const { getTotalGaleriaValue } = require("./galeriaController");
const { getTotalBlogValue } = require("./blogController");
const db = require("../models/db"); 

exports.getTotales = async (req, res) => {
  try {
    const [servicios, reservas, galeria, blogs] = await Promise.all([
      getTotalCortesValue(),
      getTotalReservasValue(),
      getTotalGaleriaValue(),
      getTotalBlogValue(),
    ]);

    res.json({ servicios, reservas, galeria, blogs });
  } catch (error) {
    console.error("Error obteniendo totales:", error);
    res.status(500).json({ msg: "Error obteniendo totales", error });
  }
};
exports.getVisitas = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT fecha, total AS visitas FROM visitas ORDER BY fecha ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo visitas:", error);
    res.status(500).json({ msg: "Error obteniendo visitas" });
  }
};
exports.registrarVisita = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split("T")[0];

    const [rows] = await db.promise().query("SELECT * FROM visitas WHERE fecha = ?", [hoy]);

    if (rows.length > 0) {
      await db.promise().query("UPDATE visitas SET total = total + 1 WHERE fecha = ?", [hoy]);
    } else {
      await db.promise().query("INSERT INTO visitas (fecha, total) VALUES (?, 1)", [hoy]);
    }

    res.json({ msg: "Visita registrada" });
  } catch (error) {
    console.error("Error registrando visita:", error);
    res.status(500).json({ msg: "Error registrando visita" });
  }
};
exports.getVisitasMensuales = async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT DATE_FORMAT(fecha, '%Y-%m') AS mes, SUM(total) AS visitas
      FROM visitas
      GROUP BY mes
      ORDER BY mes ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo visitas mensuales:", error);
    res.status(500).json({ msg: "Error obteniendo visitas mensuales" });
  }
};
