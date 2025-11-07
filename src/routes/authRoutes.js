/**
 * Rutas del módulo de autentificador.
 * 
 * Define los endpoints relacionados con los usuarios.
 * incluyendo registro, login y verificación.
 * 
 */

const express = require("express");
const router = express.Router();
const { register, login, getLoggedUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/Users");


router.post("/register", register);
router.post("/login", login); 
router.get("/logged", verifyToken, getLoggedUser);

module.exports = router;
