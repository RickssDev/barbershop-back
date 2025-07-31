const express = require("express");
const router = express.Router();
const { reservas, obtenerReservas, obtenerReservasPorFecha } = require("../controllers/reservaController");

router.post("/", reservas);
router.get("/", obtenerReservas);
router.get("/disponibilidad", obtenerReservasPorFecha);

module.exports = router;
