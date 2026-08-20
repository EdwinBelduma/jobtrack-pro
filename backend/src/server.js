const express = require("express");
const cors = require("cors");
const dns = require("dns");

require("dotenv").config();

/*
|--------------------------------------------------------------------------
| DNS
|--------------------------------------------------------------------------
|
| Forzamos a Node.js a utilizar Google DNS.
| Esto ayuda con errores querySrv ECONNREFUSED
| al conectarse a MongoDB Atlas mediante mongodb+srv://
|
*/

dns.setServers([
  "8.8.8.8",
  "8.8.4.4"
]);

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");

const app = express();

/*
|--------------------------------------------------------------------------
| BASE DE DATOS
|--------------------------------------------------------------------------
*/

connectDB();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| En desarrollo permite localhost.
| En producción permitirá el frontend definido en FRONTEND_URL.
|
*/

const origenesPermitidos = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Permite solicitudes sin origin,
       * por ejemplo:
       * Thunder Client
       * Postman
       * apps móviles
       */
      if (!origin) {
        return callback(null, true);
      }

      if (origenesPermitidos.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          "Origen no permitido por CORS"
        )
      );
    },

    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| MIDDLEWARES
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: "1mb"
  })
);

/*
|--------------------------------------------------------------------------
| RUTAS
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/applications",
  applicationRoutes
);

/*
|--------------------------------------------------------------------------
| RUTA PRINCIPAL
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje:
      "API JobTrack Pro funcionando correctamente",
    estado: "online"
  });
});

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    servicio: "JobTrack Pro API",
    estado: "online",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| RUTA NO ENCONTRADA
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    mensaje: "Ruta no encontrada"
  });
});

/*
|--------------------------------------------------------------------------
| MANEJO GENERAL DE ERRORES
|--------------------------------------------------------------------------
*/

app.use((error, req, res, next) => {
  console.error(
    "Error del servidor:",
    error.message
  );

  if (
    error.message ===
    "Origen no permitido por CORS"
  ) {
    return res.status(403).json({
      mensaje:
        "El origen de la solicitud no está permitido"
    });
  }

  res.status(500).json({
    mensaje:
      "Error interno del servidor"
  });
});

/*
|--------------------------------------------------------------------------
| SERVIDOR
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `JobTrack Pro API ejecutándose en puerto ${PORT}`
  );

  console.log(
    `Entorno: ${
      process.env.NODE_ENV ||
      "development"
    }`
  );
});