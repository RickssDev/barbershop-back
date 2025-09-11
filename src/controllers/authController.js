const db = require("../models/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    
    const hashedPassword = bcrypt.hashSync(password, 10);


    db.query(
        "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ msg: "El email ya está registrado" });
                }
                return res.status(500).json({ msg: "Error en el servidor", error: err });
            }
            res.status(201).json({ msg: "Usuario registrado correctamente" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).json({ msg: "Error en el servidor", error: err });
        if (results.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

        const user = results[0];

        
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) return res.status(401).json({ msg: "Contraseña incorrecta" });

        
        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.status(200).json({ msg: "Login exitoso", token, user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol } });
    });
};
exports.getLoggedUser = (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ msg: "No autorizado" });

  db.query(
    "SELECT id, nombre, email, rol, foto FROM usuarios WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "Error en el servidor", error: err });
      if (results.length === 0) return res.status(404).json({ msg: "Usuario no encontrado" });

      res.status(200).json(results[0]); // devuelve directamente el usuario
    }
  );
};

