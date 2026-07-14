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

const actualizarPostulacion = async (req, res) => {
    try {
        const postulacion = await Application.findOneAndUpdate(
            {
                _id: req.params.id,
                usuario: req.usuario.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!postulacion) {
            return res.status(404).json({
                mensaje: "Postulación no encontrada"
            });
        }

        res.json({
            mensaje: "Postulación actualizada correctamente",
            postulacion
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la postulación"
        });
    }
};

const eliminarPostulacion = async (req, res) => {
    try {
        const postulacion = await Application.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuario.id
        });

        if (!postulacion) {
            return res.status(404).json({
                mensaje: "Postulación no encontrada"
            });
        }

        res.json({
            mensaje: "Postulación eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la postulación"
        });
    }
};

module.exports = {
    crearPostulacion,
    obtenerPostulaciones,
    actualizarPostulacion,
    eliminarPostulacion
};