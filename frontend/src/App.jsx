import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./pages/Dashboard";
import Registro from "./pages/Registro";

import {
  BriefcaseBusiness,
  LockKeyhole,
  Mail,
  LoaderCircle,
  Eye,
  EyeOff
} from "lucide-react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [logueado, setLogueado] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const configuracionGuardada = JSON.parse(
      localStorage.getItem("configuracion")
    );

    if (configuracionGuardada?.tema === "oscuro") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        respuesta.data.token
      );

      localStorage.setItem(
        "usuario",
        JSON.stringify(respuesta.data.usuario)
      );

      setMensaje("Inicio de sesión exitoso");
      setLogueado(true);

    } catch (error) {
      if (error.response) {
        setMensaje(
          error.response.data.mensaje ||
          "Correo o contraseña incorrectos"
        );
      } else {
        setMensaje(
          "No se pudo conectar con el servidor"
        );
      }
    } finally {
      setCargando(false);
    }
  };

  if (logueado) {
    return <Dashboard />;
  }

  if (mostrarRegistro) {
    return (
      <Registro
        volverLogin={() =>
          setMostrarRegistro(false)
        }
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-900 lg:grid lg:grid-cols-2">

      {/* LADO IZQUIERDO */}
      <section className="hidden min-h-screen bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-12">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-600 p-3">
            <BriefcaseBusiness size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              JobTrack Pro
            </h1>

            <p className="text-sm text-slate-400">
              Control inteligente de postulaciones
            </p>
          </div>

        </div>

        <div>

          <h2 className="max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
            Convierte tu búsqueda de empleo en un proceso organizado.
          </h2>

          <p className="mt-6 max-w-lg text-base text-slate-300 xl:text-lg">
            Gestiona empresas, entrevistas, pruebas técnicas,
            contactos y estadísticas desde un solo lugar.
          </p>

        </div>

        <p className="text-sm text-slate-500">
          React · Node.js · Express · MongoDB
        </p>

      </section>

      {/* LOGIN */}
      <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl transition-colors dark:bg-slate-800 sm:rounded-3xl sm:p-8">

          {/* LOGO MÓVIL */}
          <div className="mb-7 lg:hidden">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-600 p-2.5 text-white sm:p-3">
                <BriefcaseBusiness size={23} />
              </div>

              <div>

                <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  JobTrack Pro
                </h1>

                <p className="text-xs text-slate-400">
                  Career Manager
                </p>

              </div>

            </div>

          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Ingresa tus datos para acceder al panel.
          </p>

          <form
            onSubmit={iniciarSesion}
            className="mt-6 space-y-5 sm:mt-8"
          >

            {/* CORREO */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Correo electrónico
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-600 dark:border-slate-600 sm:px-4">

                <Mail
                  size={19}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="edwin@test.com"
                  required
                  className="min-w-0 w-full border-0 bg-transparent px-3 py-3.5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />

              </div>

            </div>

            {/* CONTRASEÑA */}
            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Contraseña
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-600 dark:border-slate-600 sm:px-4">

                <LockKeyhole
                  size={19}
                  className="shrink-0 text-slate-400"
                />

                <input
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                  required
                  className="min-w-0 w-full border-0 bg-transparent px-3 py-3.5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }
                  className="shrink-0 rounded-lg p-1 text-slate-400 transition hover:text-blue-600 dark:hover:text-blue-400"
                  title={
                    mostrarPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {mostrarPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* MENSAJE */}
            {mensaje && (

              <div
                className={`rounded-xl p-3 text-sm ${
                  mensaje ===
                  "Inicio de sesión exitoso"
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {mensaje}
              </div>

            )}

            {/* BOTÓN */}
            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {cargando ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                  Ingresando...
                </>
              ) : (
                "Ingresar"
              )}

            </button>

          </form>

          {/* REGISTRO */}
          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 sm:mt-8">

            ¿Todavía no tienes una cuenta?{" "}

            <button
              type="button"
              onClick={() =>
                setMostrarRegistro(true)
              }
              className="font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Crear cuenta
            </button>

          </p>

        </div>

      </section>

    </main>
  );
}

export default App;