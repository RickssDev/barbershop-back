/**
 * Rutas del módulo de galería.
 * 
 * Define los endpoints relacionados con las publicaciones de imagenes,
 * incluyendo operaciones de creación, eliminación y control de visibilidad.
 * 
 */
const express = require("express");
const router = express.Router();
const galeriaController = require("../controllers/galeriaController");
const upload = require("../middleware/upload");

router.get("/", galeriaController.obtenerGaleria);
router.post("/", upload.single("imagen"), galeriaController.agregarFoto);
router.put("/:id", galeriaController.actualizarVisibilidad);
router.delete("/:id", galeriaController.eliminarFoto);
router.get("/total", galeriaController.obtenerTotalGaleria);
module.exports = router;
