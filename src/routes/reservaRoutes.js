const express = require("express");
const router = express.Router();
const { reservas, obtenerReservas, obtenerReservasPorFecha, completarReserva } = require("../controllers/reservaController");

router.post("/", reservas);
router.get("/", obtenerReservas);
router.get("/disponibilidad", obtenerReservasPorFecha);
router.delete("/:id", completarReserva);

module.exports = router;
