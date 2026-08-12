import { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Save
} from "lucide-react";

function Configuracion() {
  const configuracionGuardada = JSON.parse(
    localStorage.getItem("configuracion")
  );

  const [notificaciones, setNotificaciones] = useState(
    configuracionGuardada?.notificaciones ?? true
  );

  const [tema, setTema] = useState(
    configuracionGuardada?.tema || "claro"
  );

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (tema === "oscuro") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [tema]);

  const guardarConfiguracion = () => {
    localStorage.setItem(
      "configuracion",
      JSON.stringify({
        notificaciones,
        tema
      })
    );

    setMensaje("Configuración guardada correctamente");

    setTimeout(() => {
      setMensaje("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white md:p-8">

      <div className="mx-auto max-w-4xl">

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Preferencias
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Configuración
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Personaliza tu experiencia en JobTrack Pro.
          </p>

        </header>

        <div className="space-y-6">

          <section className="rounded-2xl bg-white p-7 shadow-sm transition-colors dark:bg-slate-800">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                <Bell size={22} />
              </div>

              <div>

                <h2 className="font-bold">
                  Notificaciones
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Recibe recordatorios sobre entrevistas y procesos.
                </p>

              </div>

            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-700">

              <div>

                <p className="font-medium">
                  Recordatorios de entrevistas
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Mostrar alertas para entrevistas próximas.
                </p>

              </div>

              <button
                onClick={() => setNotificaciones(!notificaciones)}
                className={`relative h-7 w-12 rounded-full transition ${
                  notificaciones
                    ? "bg-blue-600"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    notificaciones
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </section>

          <section className="rounded-2xl bg-white p-7 shadow-sm transition-colors dark:bg-slate-800">

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                <Settings size={22} />
              </div>

              <div>

                <h2 className="font-bold">
                  Apariencia
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Selecciona cómo quieres visualizar la aplicación.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <button
                onClick={() => setTema("claro")}
                className={`rounded-xl border p-5 text-left transition ${
                  tema === "claro"
                    ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                }`}
              >

                <Sun size={24} className="text-blue-600 dark:text-blue-400" />

                <p className="mt-4 font-semibold">
                  Modo claro
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Interfaz clara y luminosa.
                </p>

              </button>

              <button
                onClick={() => setTema("oscuro")}
                className={`rounded-xl border p-5 text-left transition ${
                  tema === "oscuro"
                    ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                }`}
              >

                <Moon size={24} className="text-blue-600 dark:text-blue-400" />

                <p className="mt-4 font-semibold">
                  Modo oscuro
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Reduce el brillo durante la noche.
                </p>

              </button>

            </div>

          </section>

          {mensaje && (
            <div className="rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
              {mensaje}
            </div>
          )}

          <div className="flex justify-end">

            <button
              onClick={guardarConfiguracion}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              <Save size={19} />
              Guardar configuración
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Configuracion;