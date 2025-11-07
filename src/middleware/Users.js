/**
 * Middleware para verificar la validez del/los token.
 * 
 * Este middleware protege las rutas que requieren autenticación.
 * Verifica la validez del token enviado por el cliente
 * antes de permitir el acceso a rutas protegidas.
 */
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRol = decoded.rol;
    next();
  } catch (err) {
    console.error("Error JWT:", err);

    // detecta si el token expiró
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Sesión expirada" });
    }

    return res.status(401).json({ msg: "Token inválido" });
  }
};
