/**
 * Rutas del módulo dashboard.
 * 
 * Define los endpoints relacionados con las estadísticas del sistema,
 * incluyendo totales generales, registro de visitas y reportes mensuales.
 * 
 */
const express = require("express");
const router = express.Router();
const { getTotales, getVisitas, registrarVisita, getVisitasMensuales } = require("../controllers/dashController");

router.get("/totales", getTotales);
router.get("/visitas", getVisitas);
router.post("/visitas", registrarVisita);
router.get("/visitasMensuales", getVisitasMensuales);


module.exports = router;
