const express = require("express");
const router = express.Router();
const reservaController = require("../controllers/reservaController");

router.post("/", reservaController.reservas);
router.get("/", reservaController.obtenerReservas);
router.get("/disponibilidad", reservaController.obtenerReservasPorFecha);
router.delete("/:id", reservaController.completarReserva);
router.get("/total", reservaController.obtenerTotalReservas);
module.exports = router;
