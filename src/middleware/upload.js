/**
 * Configuración de multer para la gestión de cargas de archivos.
 * 
 * Este módulo define la estrategia de almacenamiento en disco, 
 * especificando la carpeta donde se guardarán los archivos agregados 
 * y el formato de nombre único que se les asignará.
 *
 */
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({ //guarda en disco en lugar de memoria
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) { //nombre a guardar
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); //crea nombre único
  },
});

const upload = multer({ storage });

module.exports = upload;
