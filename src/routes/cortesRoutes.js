const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../models/db"); 


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cortes");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


router.post("/crear", upload.single("imagen"), (req, res) => {
  const { nombre, descripcion, precio, duracion } = req.body;
  const imagen = req.file ? req.file.filename : null; //codicional

  if (!nombre || !precio || !duracion || !imagen) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO cortes (nombre, descripcion, precio, duracion, imagen) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, descripcion, precio, duracion, imagen], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al insertar el corte", error: err });

    res.status(200).json({ msg: "Corte creado exitosamente", corteId: result.insertId });
  });
});

router.get("/", (req, res) => {
  const sql = "SELECT * FROM cortes";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener cortes", error: err });

  
    const cortesConImagen = results.map(corte => ({
      ...corte,
      imagen: `http://localhost:3000/uploads/cortes/${corte.imagen}`
    }));

    res.status(200).json(cortesConImagen);
  });
});


module.exports = router;

