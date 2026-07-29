const Application = require("../models/Application");

const crearPostulacion = async (req, res) => {
    try {
        const {
            empresa,
            cargo,
            salario,
            moneda,
            ciudad,
            pais,
            modalidad,
            nivel,
            tecnologias,
            fechaPostulacion,
            fechaEntrevista,
            estado,
            prioridad,
            urlOferta,
            contactoRRHH,
            correoRRHH,
            telefonoRRHH,
            observaciones
        } = req.body;

        const postulacion = await Application.create({
            empresa,
            cargo,
            salario,
            moneda,
            ciudad,
            pais,
            modalidad,
            nivel,
            tecnologias,
            fechaPostulacion,
            fechaEntrevista,
            estado,
            prioridad,
            urlOferta,
            contactoRRHH,
            correoRRHH,
            telefonoRRHH,
            observaciones,
            usuario: req.usuario.id
        });

        res.status(201).json({
            mensaje: "Postulación creada correctamente",
            postulacion
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            mensaje: "Error al crear la postulación",
            error: error.message
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

const obtenerEstadisticas = async (req, res) => {
    try {
        const usuarioId = req.usuario.id;

        const total = await Application.countDocuments({
            usuario: usuarioId
        });

        const enviadas = await Application.countDocuments({
            usuario: usuarioId,
            estado: "Enviado"
        });

        const entrevistas = await Application.countDocuments({
            usuario: usuarioId,
            estado: "Entrevista"
        });

        const pruebasTecnicas = await Application.countDocuments({
            usuario: usuarioId,
            estado: "Prueba Técnica"
        });

        const contratadas = await Application.countDocuments({
            usuario: usuarioId,
            estado: "Contratado"
        });

        const rechazadas = await Application.countDocuments({
            usuario: usuarioId,
            estado: "Rechazado"
        });

        res.json({
            total,
            enviadas,
            entrevistas,
            pruebasTecnicas,
            contratadas,
            rechazadas
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            mensaje: "Error al obtener las estadísticas"
        });
    }
};

module.exports = {
    crearPostulacion,
    obtenerPostulaciones,
    actualizarPostulacion,
    eliminarPostulacion,
    obtenerEstadisticas
};
