/**
 * Controlador de servicios de cortes de pelo.
 * 
 * Este módulo gestiona las operaciones relacionadas con los cortes de pelo, con funciones 
 * básicas de un CRUD. Además de manejar sus numeros totales.
 * 
 * 
 * @dependencies
 * - db: conexión a la base de datos MySQL.
 * 
 * Funciones exportadas:
 * - crearCorte: hace una breve verificación de campos, 
 * para despues insertar un nuevo registro en la tabla de cortes.
 * - obtenerVisibles: muestra unicamente los cores con bandera positiva (1).
 * - obtenerTodos: realiza la carga de los cortes.
 * - toggleVisible: realiza el cambio de estado (1)-(0), según sea su uso.
 * - ediarCorte: permite editar la informacion de un servicio existente. En caso de adjuntar
 * una nueva imagen, la reemplazará, actualizando así todos los campos y mostrando un msg de exito.
 * - eliminarCorte: se borra el corte mediante su id y muestra un mensaje de exito.
 * - obtenerTotalCortes: realiza una consulta sql para contar y muestrar todos los cortes en existencia.
 * - getTotalCortesValue: permite consultar el total de cortes para usarlo en otras funciones o módulos.
 */

const path = require("path");
const db = require("../models/db");

exports.crearCorte = (req, res) => {
  const { nombre, descripcion, precio, duracion } = req.body;
  const imagen = req.file ? req.file.filename : null;

  if (!nombre || !precio || !duracion || !imagen) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const sql ="INSERT INTO cortes (nombre, descripcion, precio, duracion, imagen) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [nombre, descripcion, precio, duracion, imagen], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al insertar el corte", error: err });

    res.status(200).json({ msg: "Corte creado exitosamente", corteId: result.insertId });
  });
};


exports.obtenerVisibles = (req, res) => {
  const sql = "SELECT * FROM cortes WHERE visible = 1";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener cortes", error: err });

    const cortesConImagen = results.map((corte) => ({
      ...corte,
      imagen: `http://localhost:3000/uploads/cortes/${corte.imagen}`,
    }));

    res.status(200).json(cortesConImagen);
  });
};

exports.obtenerTodos = (req, res) => {
  const sql = "SELECT * FROM cortes";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener cortes", error: err });

    const cortesConImagen = results.map((corte) => ({
      ...corte,
      imagen: `http://localhost:3000/uploads/cortes/${corte.imagen}`,
    }));

    res.status(200).json(cortesConImagen);
  });
};

exports.toggleVisible = (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE cortes SET visible = NOT visible WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar visibilidad", error: err });
    res.status(200).json({ msg: "Visibilidad actualizada" });
  });
};

exports.editarCorte = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, duracion } = req.body;
  const nuevaImagen = req.file ? req.file.filename : null;

  let sql, values;

  if (nuevaImagen) {
    sql = "UPDATE cortes SET nombre=?, descripcion=?, precio=?, duracion=?, imagen=? WHERE id=?";
    values = [nombre, descripcion, precio, duracion, nuevaImagen, id];
  } else {
    sql = "UPDATE cortes SET nombre=?, descripcion=?, precio=?, duracion=? WHERE id=?";
    values = [nombre, descripcion, precio, duracion, id];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar servicio", error: err });
    res.status(200).json({ msg: "Servicio actualizado correctamente" });
  });
};

exports.eliminarCorte = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM cortes WHERE id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al eliminar servicio", eror: err });
    res.status(200).json({ msg: "Servicio eliminado correctamente" });r
  });
};

exports.obtenerTotalCortes = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM cortes", (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al obtener total servicios", error: err });
    res.json({ total: result[0].total });
  });
};

exports.getTotalCortesValue = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM cortes", (err, result) => {
      if (err) reject(err);
      resolve(result[0].total);
    });
  });
};

