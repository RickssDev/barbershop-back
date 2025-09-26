const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({ //guarda en disco en lugar de memoria
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) { //nombre a guardar
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); //crea nombre único
  },
});

const upload = multer({ storage });

module.exports = upload;
