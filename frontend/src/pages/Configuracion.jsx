import { useEffect, useState } from "react";

import {
  Settings,
  Bell,
  BellRing,
  BellOff,
  Moon,
  Sun,
  Save,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

function Configuracion() {
  const configuracionGuardada = JSON.parse(
    localStorage.getItem("configuracion")
  );

  const [notificaciones, setNotificaciones] = useState(
    configuracionGuardada?.notificaciones ?? true
  );

  const [
    notificacionesNavegador,
    setNotificacionesNavegador
  ] = useState(
    configuracionGuardada?.notificacionesNavegador ?? false
  );

  const [tema, setTema] = useState(
    configuracionGuardada?.tema || "claro"
  );

  const [mensaje, setMensaje] = useState("");

  const [permisoNavegador, setPermisoNavegador] =
    useState(() => {
      if (!("Notification" in window)) {
        return "no-compatible";
      }

      return Notification.permission;
    });

  useEffect(() => {
    if (tema === "oscuro") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [tema]);

  const solicitarPermisoNotificaciones = async () => {
    if (!("Notification" in window)) {
      setMensaje(
        "Este navegador no permite notificaciones."
      );

      return;
    }

    try {
      const permiso =
        await Notification.requestPermission();

      setPermisoNavegador(permiso);

      if (permiso === "granted") {
        setNotificacionesNavegador(true);
        setNotificaciones(true);

        setMensaje(
          "Notificaciones del navegador activadas correctamente"
        );

        new Notification("JobTrack Pro", {
          body: "Las notificaciones están funcionando correctamente.",
          tag: "jobtrack-prueba"
        });

      } else if (permiso === "denied") {
        setNotificacionesNavegador(false);

        setMensaje(
          "El navegador bloqueó las notificaciones. Puedes habilitarlas desde los permisos del sitio."
        );

      } else {
        setNotificacionesNavegador(false);

        setMensaje(
          "No se concedió permiso para mostrar notificaciones."
        );
      }

    } catch (error) {
      console.error(
        "Error al solicitar permiso:",
        error
      );

      setMensaje(
        "No se pudo solicitar permiso para las notificaciones."
      );
    }
  };

  const desactivarNotificacionesNavegador = () => {
    setNotificacionesNavegador(false);

    setMensaje(
      "Notificaciones del navegador desactivadas en JobTrack Pro"
    );
  };

  const guardarConfiguracion = () => {
    localStorage.setItem(
      "configuracion",
      JSON.stringify({
        notificaciones,
        notificacionesNavegador,
        tema
      })
    );

    setMensaje(
      "Configuración guardada correctamente"
    );

    setTimeout(() => {
      setMensaje("");
    }, 3000);
  };

  const obtenerEstadoPermiso = () => {
    if (permisoNavegador === "granted") {
      return {
        texto: "Permiso concedido",
        clases:
          "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300",
        icono: (
          <CheckCircle2 size={17} />
        )
      };
    }

    if (permisoNavegador === "denied") {
      return {
        texto: "Permiso bloqueado",
        clases:
          "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
        icono: (
          <BellOff size={17} />
        )
      };
    }

    if (permisoNavegador === "no-compatible") {
      return {
        texto: "No compatible",
        clases:
          "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
        icono: (
          <AlertTriangle size={17} />
        )
      };
    }

    return {
      texto: "Permiso pendiente",
      clases:
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      icono: (
        <AlertTriangle size={17} />
      )
    };
  };

  const estadoPermiso =
    obtenerEstadoPermiso();

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white sm:p-6 md:p-8">

      <div className="mx-auto w-full max-w-4xl">

        <header className="mb-6 sm:mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Preferencias
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Configuración
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Personaliza tu experiencia en JobTrack Pro.
          </p>

        </header>

        <div className="space-y-5 sm:space-y-6">

          {/* RECORDATORIOS */}
          <section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6 md:p-7">

            <div className="flex items-start gap-3">

              <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400 sm:p-3">
                <Bell size={22} />
              </div>

              <div className="min-w-0">

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Recordatorios
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Configura las alertas relacionadas con tus entrevistas.
                </p>

              </div>

            </div>

            <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-700 sm:mt-6">

              <div className="min-w-0">

                <p className="font-medium text-slate-900 dark:text-white">
                  Recordatorios de entrevistas
                </p>

                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Mostrar alertas dentro de JobTrack Pro cuando una entrevista sea hoy o mañana.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setNotificaciones(
                    !notificaciones
                  )
                }
                className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                  notificaciones
                    ? "bg-blue-600"
                    : "bg-slate-300 dark:bg-slate-600"
                }`}
                aria-label={
                  notificaciones
                    ? "Desactivar recordatorios"
                    : "Activar recordatorios"
                }
              >

                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                    notificaciones
                      ? "left-6"
                      : "left-1"
                  }`}
                />

              </button>

            </div>

          </section>

          {/* NOTIFICACIONES DEL NAVEGADOR */}
          <section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6 md:p-7">

            <div className="flex items-start gap-3">

              <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400 sm:p-3">
                <BellRing size={22} />
              </div>

              <div className="min-w-0">

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Notificaciones del navegador
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Permite que JobTrack Pro muestre avisos del sistema cuando tengas una entrevista próxima.
                </p>

              </div>

            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-700 sm:mt-6">

              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                  <p className="font-medium text-slate-900 dark:text-white">
                    Estado del permiso
                  </p>

                  <div
                    className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${estadoPermiso.clases}`}
                  >
                    {estadoPermiso.icono}

                    {estadoPermiso.texto}
                  </div>

                </div>

                {permisoNavegador !== "granted" ? (

                  <button
                    type="button"
                    onClick={
                      solicitarPermisoNotificaciones
                    }
                    disabled={
                      permisoNavegador ===
                      "no-compatible"
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    <BellRing size={17} />
                    Permitir notificaciones
                  </button>

                ) : notificacionesNavegador ? (

                  <button
                    type="button"
                    onClick={
                      desactivarNotificacionesNavegador
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30 sm:w-auto"
                  >
                    <BellOff size={17} />
                    Desactivar
                  </button>

                ) : (

                  <button
                    type="button"
                    onClick={() =>
                      setNotificacionesNavegador(
                        true
                      )
                    }
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                  >
                    <BellRing size={17} />
                    Activar en JobTrack Pro
                  </button>

                )}

              </div>

              {permisoNavegador === "denied" && (

                <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  El permiso fue bloqueado por el navegador. Debes habilitar las notificaciones desde los permisos del sitio.
                </div>

              )}

              {permisoNavegador ===
                "granted" &&
                notificacionesNavegador && (

                <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-300">
                  JobTrack Pro puede mostrar notificaciones cuando detecte entrevistas para hoy o mañana.
                </div>

              )}

            </div>

          </section>

          {/* APARIENCIA */}
          <section className="rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800 sm:p-6 md:p-7">

            <div className="flex items-start gap-3">

              <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400 sm:p-3">
                <Settings size={22} />
              </div>

              <div className="min-w-0">

                <h2 className="font-bold text-slate-900 dark:text-white">
                  Apariencia
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Selecciona cómo quieres visualizar la aplicación.
                </p>

              </div>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2">

              <button
                type="button"
                onClick={() =>
                  setTema("claro")
                }
                className={`rounded-xl border p-4 text-left transition sm:p-5 ${
                  tema === "claro"
                    ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                }`}
              >

                <Sun
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />

                <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Modo claro
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Interfaz clara y luminosa.
                </p>

              </button>

              <button
                type="button"
                onClick={() =>
                  setTema("oscuro")
                }
                className={`rounded-xl border p-4 text-left transition sm:p-5 ${
                  tema === "oscuro"
                    ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                    : "border-slate-200 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-700"
                }`}
              >

                <Moon
                  size={24}
                  className="text-blue-600 dark:text-blue-400"
                />

                <p className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Modo oscuro
                </p>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Reduce el brillo durante la noche.
                </p>

              </button>

            </div>

          </section>

          {mensaje && (

            <div
              className={`rounded-xl p-4 text-sm font-medium ${
                mensaje.includes(
                  "correctamente"
                ) ||
                mensaje.includes(
                  "activadas"
                )
                  ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {mensaje}
            </div>

          )}

          <div className="flex justify-end">

            <button
              type="button"
              onClick={
                guardarConfiguracion
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
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