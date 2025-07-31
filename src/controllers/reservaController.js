const db = require("../models/db");
exports.reservas = (req, res) => {
    const { nombre_cliente, email, fecha, hora, servicio, comentario } = req.body;

    if (!nombre_cliente || !email || !fecha || !hora || !servicio) {
        return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

        const emailinvalid= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailinvalid.test(email)){
                    return res.status(400).json({msg: "El email no es válido"});
                }

        const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!fechaRegex.test(fecha)) {
        return res.status(400).json({ msg: "El formato de la fecha es inválido, debe ser YYYY-MM-DD" });
        }
        
                
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