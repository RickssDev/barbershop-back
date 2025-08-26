const express = require("express");
const router = express.Router();
const galeriaController = require("../controllers/galeriaController");
const upload = require("../middleware/upload"); // ← tu archivo de multer

// Rutas CRUD de galería
router.get("/", galeriaController.obtenerGaleria);
router.post("/", upload.single("imagen"), galeriaController.agregarFoto);
router.put("/:id", galeriaController.actualizarVisibilidad);
router.delete("/:id", galeriaController.eliminarFoto);

module.exports = router;
