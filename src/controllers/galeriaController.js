/**
 * Controlador de la galería de imágenes.
 * 
 * Este módulo gestiona las operaciones relacionadas con las imagenes (galería), con funciones 
 * básicas de un CRUD. Además de manejar sus numeros totales.
 * 
 * @dependencies
 * - db: conexión a la base de datos MySQL.
 * 
 * Funciones exportadas:
 * - obtenerGaleria: realiza la carga de las fotos, y las muestra de manera ascendente.
 * - agregarFoto: hace una breve verificación de campo, para después insertar 
 * un nuevo registro en la tabla de galeria.
 * - actualizarVisibilidad: realiza el cambio de estado (1)-(0), según sea su uso.
 * - eliminarFoto: se borra la foto mediante su id, se elimina el archivo de la carpeta "uploads" y
 * posteriormente muestra un mensaje de exito.
 * - obtenerTotalGaleria: realiza una consulta sql para contar y muestrar todas las fotos en existencia.
 * - getTotalGaleriaValue: permite consultar el total de imagenes para usarlo en otras funciones o módulos.
 */

const db = require("../models/db");

exports.obtenerGaleria = (req, res) => {
  const sql = "SELECT * FROM galeria ORDER BY id ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener fotos", err });
    res.json(results);
  });
};

exports.agregarFoto = (req, res) => {
  if (!req.file) return res.status(400).json({ msg: "No se subió ninguna imagen" });

  const { filename } = req.file;
  const sql = "INSERT INTO galeria (imagen) VALUES (?)";
  db.query(sql, [filename], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al guardar la foto", err });
    res.json({ msg: "Foto agregada con éxito", id: result.insertId, imagen: filename });
  });
};

exports.actualizarVisibilidad = (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;
  const sql = "UPDATE galeria SET visible = ? WHERE id = ?";
  db.query(sql, [visible, id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar visibilidad", err });
    res.json({ msg: "Visibilidad actualizada" });
  });
};

exports.eliminarFoto = (req, res) => {
  const { id } = req.params;

  // Primero obtenemos el nombre de la foto para borrar el archivo
  const sqlSelect = "SELECT imagen FROM galeria WHERE id = ?";
  db.query(sqlSelect, [id], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al buscar la foto", err });
    if (result.length === 0) return res.status(404).json({ msg: "Foto no encontrada" });

    const imagen = result[0].imagen;

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

exports.obtenerTotalGaleria = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM galeria", (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al obtener total galeria", error: err });
    res.json({ total: result[0].total });
  });
};

exports.getTotalGaleriaValue = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM galeria", (err, result) => {
      if (err) reject(err);
      resolve(result[0].total);
    });
  });
};