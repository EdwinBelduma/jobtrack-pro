const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        empresa: {
            type: String,
            required: [true, "El nombre de la empresa es obligatorio"],
            trim: true
        },

        cargo: {
            type: String,
            required: [true, "El cargo es obligatorio"],
            trim: true
        },

        salario: {
            type: Number,
            min: [0, "El salario no puede ser negativo"],
            default: 0
        },

        moneda: {
            type: String,
            enum: ["USD", "EUR", "COP", "PEN", "MXN", "Otra"],
            default: "USD"
        },

        ciudad: {
            type: String,
            trim: true,
            default: ""
        },

        pais: {
            type: String,
            trim: true,
            default: "Ecuador"
        },

        modalidad: {
            type: String,
            enum: ["Remoto", "Híbrido", "Presencial"],
            default: "Remoto"
        },

        nivel: {
            type: String,
            enum: ["Practicante", "Junior", "Semi Senior", "Senior"],
            default: "Junior"
        },

        tecnologias: {
            type: [String],
            default: []
        },

        fechaPostulacion: {
            type: Date,
            default: Date.now
        },

        fechaEntrevista: {
            type: Date,
            default: null
        },

        plataformaEntrevista: {
            type: String,
            enum: [
                "",
                "Google Meet",
                "Zoom",
                "Microsoft Teams",
                "Presencial",
                "Llamada telefónica",
                "Otra"
            ],
            default: ""
        },

        enlaceEntrevista: {
            type: String,
            trim: true,
            default: ""
        },

        contactoEntrevista: {
            type: String,
            trim: true,
            default: ""
        },

        notasEntrevista: {
            type: String,
            trim: true,
            default: ""
        },

        estado: {
            type: String,
            enum: [
                "Enviado",
                "En revisión",
                "Prueba Técnica",
                "Entrevista",
                "Oferta",
                "Contratado",
                "Rechazado"
            ],
            default: "Enviado"
        },

        prioridad: {
            type: String,
            enum: ["Alta", "Media", "Baja"],
            default: "Media"
        },

        urlOferta: {
            type: String,
            trim: true,
            default: ""
        },

        contactoRRHH: {
            type: String,
            trim: true,
            default: ""
        },

        correoRRHH: {
            type: String,
            trim: true,
            lowercase: true,
            default: ""
        },

        telefonoRRHH: {
            type: String,
            trim: true,
            default: ""
        },

        observaciones: {
            type: String,
            trim: true,
            default: ""
        },

        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Application", applicationSchema);