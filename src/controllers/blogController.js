const db = require("../models/db");

exports.obtenerVisibles = (req, res) => {
  const sql = "SELECT * FROM blog WHERE visible = 1 ORDER BY fecha ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener posts", error: err });
    res.json(results);
  });
};

exports.obtenerTodos = (req, res) => {
  const sql = "SELECT * FROM blog ORDER BY fecha ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener posts", error: err });
    res.json(results);
  });
};

exports.crearPost = (req, res) => {
  const { titulo, descripcion, link, visible } = req.body;
  const imagen = req.file ? req.file.filename : null;

  const sql = "INSERT INTO blog (titulo, descripcion, imagen, visible) VALUES (?, ?, ?, ?)";
  db.query(sql, [titulo, descripcion, imagen, visible || 1], (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al crear post", error: err });
    res.json({ msg: "Post creado con éxito", id: result.insertId });
  });
};

exports.actualizarPost = (req, res) => {
  const { titulo, descripcion, visible } = req.body;
  const nuevaImagen = req.file ? req.file.filename : null;
  const { id } = req.params;

  let sql, values;

  if (nuevaImagen) {
    sql = "UPDATE blog SET titulo=?, descripcion=?, imagen=?, visible=? WHERE id=?";
    values = [titulo, descripcion, nuevaImagen, visible, id];
  } else {
    sql = "UPDATE blog SET titulo=?, descripcion=?, visible=? WHERE id=?";
    values = [titulo, descripcion, visible, id];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar post", error: err });
    res.json({ msg: "Post actualizado con éxito" });
  });
};

exports.eliminarPost = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM blog WHERE id=?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al eliminar post", error: err });
    res.json({ msg: "Post eliminado con éxito" });
  });
};

exports.actualizarVisibilidad = (req, res) => {
  const { id } = req.params;
  const { visible } = req.body;

  const sql = "UPDATE blog SET visible = ? WHERE id = ?";
  db.query(sql, [visible, id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al actualizar visibilidad", err });
    res.json({ msg: "Visibilidad actualizada" });
  });
};

exports.obtenerTotalBlog = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM blog", (err, result) => {
    if (err) return res.status(500).json({ msg: "Error al obtener total blogs", error: err });
    res.json({ total: result[0].total });
  });
};

exports.getTotalBlogValue = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT COUNT(*) AS total FROM blog", (err, result) => {
      if (err) reject(err);
      resolve(result[0].total);
    });
  });
};