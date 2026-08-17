const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conexion = await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      `MongoDB conectado correctamente: ${conexion.connection.host}`
    );

    mongoose.connection.on(
      "disconnected",
      () => {
        console.warn(
          "MongoDB se ha desconectado"
        );
      }
    );

    mongoose.connection.on(
      "error",
      (error) => {
        console.error(
          "Error de conexión MongoDB:",
          error.message
        );
      }
    );

  } catch (error) {
    console.error(
      "Error al conectar MongoDB:",
      error.message
    );

    process.exit(1);
  }
};

module.exports = connectDB;