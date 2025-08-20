const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");
const upload = require("../middleware/upload"); // multer

router.get("/", usuariosController.obtenerUsuarios);

router.post("/", upload.single("foto"), usuariosController.crearUsuario);

router.put("/:id", upload.single("foto"), usuariosController.editarUsuario);

router.delete("/:id", usuariosController.eliminarUsuario);

module.exports = router;
