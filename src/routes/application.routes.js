const express = require("express");
const verificarToken = require("../middleware/auth.middleware");

const {
    crearPostulacion,
    obtenerPostulaciones
} = require("../controllers/application.controller");

const router = express.Router();

router.post("/", verificarToken, crearPostulacion);
router.get("/", verificarToken, obtenerPostulaciones);

module.exports = router;