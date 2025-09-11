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
    return res.status(401).json({ msg: "Token inválido" });
  }
};
