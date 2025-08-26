const db = require("../models/db");

// Obtener todas las fotos
exports.obtenerGaleria = (req, res) => {
  const sql = "SELECT * FROM galeria ORDER BY id ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener fotos", err });
    res.json(results);
  });
};

// Agregar una nueva foto
exports.agregarFoto = (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No se subió ninguna imagen" });

  const { filename } = req.file;
  const sql = "INSERT INTO galeria (imagen) VALUES (?)";
  db.query(sql, [filename], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al guardar la foto", err });
    res.json({ msg: "Foto agregada con éxito", id: result.insertId, imagen: filename });
  });
};

// Actualizar visibilidad
exports.actualizarVisibilidad = (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;
  const sql = "UPDATE galeria SET visible = ? WHERE id = ?";
  db.query(sql, [visible, id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar visibilidad", err });
    res.json({ msg: "Visibilidad actualizada" });
  });
};

// Eliminar una foto
exports.eliminarFoto = (req, res) => {
  const { id } = req.params;

  // Primero obtenemos el nombre de la foto para borrar el archivo
  const sqlSelect = "SELECT imagen FROM galeria WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al buscar la foto", err });
    if (result.length === 0) return res.status(404).json({ msg: "Foto no encontrada" });

    const imagen = result[0].imagen;

    // Borrar de la BD
    const sqlDelete = "DELETE FROM galeria WHERE id = ?";
    db.query(sqlDelete, [id], (err) => {
      if (err) return res.status(500).json({ msg: "Error al eliminar la foto", err });

      // Borrar archivo físico
      const fs = require("fs");
      const ruta = `uploads/${imagen}`;
      fs.unlink(ruta, (err) => {
        if (err) console.error("Error al borrar archivo físico:", err);
      });

      res.json({ msg: "Foto eliminada con éxito" });
    });
  });
};
