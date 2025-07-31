const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/authRoutes");
const reservaRoutes = require("./src/routes/reservaRoutes");

dotenv.config();
const app = express();
//middlewares
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/reservas", reservaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}`);
});
