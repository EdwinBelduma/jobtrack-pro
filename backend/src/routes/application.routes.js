const express = require("express");
const verificarToken = require("../middleware/auth.middleware");

const {
    crearPostulacion,
    obtenerPostulaciones,
    actualizarPostulacion,
    eliminarPostulacion,
    obtenerEstadisticas
} = require("../controllers/application.controller");

const router = express.Router();

router.get("/stats", verificarToken, obtenerEstadisticas);

router.post("/", verificarToken, crearPostulacion);
router.get("/", verificarToken, obtenerPostulaciones);
router.put("/:id", verificarToken, actualizarPostulacion);
router.delete("/:id", verificarToken, eliminarPostulacion);

module.exports = router;