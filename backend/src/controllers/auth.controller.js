const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registrarUsuario = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const usuarioExiste = await User.findOne({ email });

        if (usuarioExiste) {
            return res.status(400).json({ mensaje: "El usuario ya existe" });
        }

        const passwordEncriptado = await bcrypt.hash(password, 10);

        const usuario = await User.create({
            nombre,
            email,
            password: passwordEncriptado
        });

        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await User.findOne({ email });

        if (!usuario) {
            return res.status(400).json({ mensaje: "Usuario no encontrado" });
        }

        const passwordCorrecto = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecto) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            mensaje: "Login exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });

    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario
};