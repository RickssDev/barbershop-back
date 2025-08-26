const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cortesController = require("../controllers/cortesController");

// Configuración multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cortes");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Rutas
router.post("/crear", upload.single("imagen"), cortesController.crearCorte);
router.get("/", cortesController.obtenerVisibles); // cliente
router.get("/admin", cortesController.obtenerTodos); // admin
router.put("/toggle/:id", cortesController.toggleVisible);
router.put("/editar/:id", upload.single("imagen"), cortesController.editarCorte);
router.delete("/:id", cortesController.eliminarCorte);

module.exports = router;
