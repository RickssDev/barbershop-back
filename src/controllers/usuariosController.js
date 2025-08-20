const db = require("../models/db");
const bcrypt = require("bcryptjs");


exports.obtenerUsuarios = (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener usuarios" });
    res.json(results);
  });
};


exports.crearUsuario = (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ msg: "Faltan datos obligatorios" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const foto = req.file ? `/uploads/${req.file.filename}` : null;

  db.query(
    "INSERT INTO usuarios (nombre, email, password, rol, foto) VALUES (?, ?, ?, ?, ?)",
    [nombre, email, hashedPassword, rol, foto],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "Error al crear usuario", error: err });
      res.json({ id: results.insertId, nombre, email, rol, foto });
    }
  );
};

exports.editarUsuario = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM usuarios WHERE id=?", [id], (err, results) => {
    if (err) return res.status(500).json({ msg: "Error al obtener usuario" });
    if (results.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

    const usuarioActual = results[0];
    let { nombre, email, password, rol } = req.body; //desestructuración

    // Mantener valores actuales si no se envían
    nombre = nombre || usuarioActual.nombre;
    email = email || usuarioActual.email;
    rol = rol || usuarioActual.rol;

    const nuevaPassword = password ? bcrypt.hashSync(password, 10) : usuarioActual.password;
    const nuevaFoto = req.file ? `/uploads/${req.file.filename}` : usuarioActual.foto;

    // Actualizamos
    db.query(
      "UPDATE usuarios SET nombre=?, email=?, password=?, rol=?, foto=? WHERE id=?",
      [nombre, email, nuevaPassword, rol, nuevaFoto, id],
      (err) => {
        if (err) return res.status(500).json({ msg: "Error al actualizar usuario", error: err });
        res.json({ msg: "Usuario actualizado" });
      }
    );
  });
};

exports.eliminarUsuario = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ msg: "Error al eliminar usuario" });
    res.json({ msg: "Usuario eliminado" });
  });
};
