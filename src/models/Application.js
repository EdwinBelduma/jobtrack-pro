const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    empresa: {
        type: String,
        required: true
    },
    cargo: {
        type: String,
        required: true
    },
    estado: {
        type: String,
        default: "Enviado"
    },
    observaciones: {
        type: String
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model(
    "Application",
    applicationSchema
);