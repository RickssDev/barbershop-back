const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const reservaRoutes = require("./src/routes/reservaRoutes");
const cortesRoutes = require("./src/routes/cortesRoutes");
const usuariosRoutes = require("./src/routes/usuariosRoutes");
const galeriaRoutes = require("./src/routes/galeriaRoutes");
const path = require("path");

dotenv.config();
const app = express();
//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservaRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/cortes", cortesRoutes)
app.use("/api/galeria", galeriaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
