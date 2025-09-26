const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const upload = require("../middleware/upload"); 


router.get("/", blogController.obtenerVisibles);


router.get("/admin", blogController.obtenerTodos);
router.post("/", upload.single("imagen"), blogController.crearPost);
router.put("/:id", upload.single("imagen"), blogController.actualizarPost);
router.put("/visibilidad/:id", blogController.actualizarVisibilidad);
router.delete("/:id", blogController.eliminarPost);
router.get("/total", blogController.obtenerTotalBlog);
module.exports = router;
