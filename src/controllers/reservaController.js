const db = require("../models/db");

exports.reservas = (req, res) => {
    const { nombre_cliente, email, fecha, hora, servicio, comentario } = req.body;
    if (!nombre_cliente || !email || !fecha || !hora || !servicio) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }
                //validar email correcto
        const emailinvalid= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailinvalid.test(email)){
                    return res.status(400).json({msg: "El email no es válido"});
                }
                //validacion fecha correctta
        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!fechaRegex.test(fecha)) {
        return res.status(400).json({ msg: "El formato de la fecha es inválido, debe ser YYYY-MM-DD" });
        }
                //validacion de horario laboral
        const horaInt = parseInt(hora.split(':')[0], 10);  //09:00
        const minutosInt = parseInt(hora.split(':')[1], 10);
        if (horaInt < 9 || horaInt > 17 || (horaInt === 17 && minutosInt > 0)) {
        return res.status(400).json({ msg: "Horario inválido: selecciona entre 09:00 y 17:00" });
        }
                //validacion fecha y hora
        const ahora= new Date();
        const fechaHora= new Date(`${fecha}T${hora}`);

        if (fechaHora < ahora){
                    return res.status(400).json ({msg: "No se puede reservar en una fecha pasada u hora pasada"});
                }   
            
        

    db.query(
        "INSERT INTO reservas (nombre_cliente, email, fecha, hora, servicio, comentario) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre_cliente, email, fecha, hora, servicio, comentario ],
        (err, result) => {
            if (err) {
            
                return res.status(500).json({ msg: "Error en el servidor", error: err });
            }
            res.status(201).json({ msg: "Reserva creada correctamente" });
        }
    );
};

exports.obtenerReservas = (req, res) => {
    db.query(
        "SELECT * FROM reservas ORDER BY fecha DESC, hora DESC",
        (err, results) => {
            if (err) {
                return res.status(500).json({ msg: "Error al obtener las reservas", error: err });
            }
            res.status(200).json(results);
        }
    );
}
exports.obtenerReservasPorFecha = (req, res) => {
  const fecha = req.query.fecha;

  if (!fecha) {
    return res.status(400).json({ msg: "Debe enviar la fecha como query param" });
  }

  const fechaRegex = /^\d{4}-\d{2}-\d{2}$/; //formato fecha
  if (!fechaRegex.test(fecha)) {
    return res.status(400).json({ msg: "Formato de fecha inválido, debe ser YYYY-MM-DD" });
  }

  const sql = "SELECT hora FROM reservas WHERE fecha = ? ORDER BY hora ASC";

  db.query(sql, [fecha], (err, results) => {
    if (err) {
      return res.status(500).json({ msg: "Error en el servidor", error: err });
    }
    const horasOcupadas = results.map(r => r.hora); //obtiene la hora de la reserva
    res.status(200).json(horasOcupadas);
  });
};
// Eliminar reserva por ID (completar trabajo)
exports.completarReserva = (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "ID de reserva es requerido" });
  }

  db.query("DELETE FROM reservas WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Error al eliminar la reserva", error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Reserva no encontrada" });
    }

    res.status(200).json({ msg: "Reserva completada exitosamente" });
  });
};




