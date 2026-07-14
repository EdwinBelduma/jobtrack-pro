const express = require("express");
const verificarToken = require("../middleware/auth.middleware");

const {
    crearPostulacion,
    obtenerPostulaciones,
    actualizarPostulacion,
    eliminarPostulacion
} = require("../controllers/application.controller");

const router = express.Router();

router.post("/", verificarToken, crearPostulacion);
router.get("/", verificarToken, obtenerPostulaciones);
router.put("/:id", verificarToken, actualizarPostulacion);
router.delete("/:id", verificarToken, eliminarPostulacion);

module.exports = router;