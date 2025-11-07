/**
 * Rutas del módulo de reservas.
 * 
 * Define los endpoints relacionados con las citas/reservas en el sistema,
 * incluyendo operaciones de verificación de fechas y sistema de confirmación/cancelación de citas.
 * 
 */

const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

router.post("/", reservaController.reservas);
router.get("/", reservaController.obtenerReservas);
router.get("/disponibilidad", reservaController.obtenerReservasPorFecha);
router.delete("/:id", reservaController.completarReserva);
router.get("/total", reservaController.obtenerTotalReservas);
module.exports = router;
