const Application = require("../models/Application");

const crearPostulacion = async (req, res) => {
    try {
        const { empresa, cargo, estado, observaciones } = req.body;

        const postulacion = await Application.create({
            empresa,
            cargo,
            estado,
            observaciones,
            usuario: req.usuario.id
        });

        res.status(201).json({
            mensaje: "Postulación creada correctamente",
            postulacion
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la postulación"
        });
    }
};

const obtenerPostulaciones = async (req, res) => {
    try {
        const postulaciones = await Application.find({
            usuario: req.usuario.id
        }).sort({ createdAt: -1 });

        res.json(postulaciones);

    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener postulaciones"
        });
    }
};

module.exports = {
    crearPostulacion,
    obtenerPostulaciones
};