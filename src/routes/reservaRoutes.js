const express = require("express");
const router = express.Router();
const { reservas } = require("../controllers/reservaController");

router.post("/", reservas);

module.exports = router;
