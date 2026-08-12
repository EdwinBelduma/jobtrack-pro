import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  FileCode2,
  CheckCircle2
} from "lucide-react";

function Perfil() {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    total: 0,
    entrevistas: 0,
    pruebasTecnicas: 0,
    contratadas: 0
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const respuesta = await axios.get(
          "http://localhost:5000/api/applications/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats(respuesta.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    cargarEstadisticas();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white md:p-8">

      <div className="mx-auto max-w-6xl">

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Cuenta
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            Mi perfil
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Información de tu cuenta y actividad en JobTrack Pro.
          </p>

        </header>

        <section className="grid gap-6 lg:grid-cols-3">

          <div className="rounded-2xl bg-white p-7 shadow-sm transition-colors dark:bg-slate-800">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                <User size={42} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                {usuario?.nombre || "Usuario"}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Usuario de JobTrack Pro
              </p>

            </div>

            <div className="mt-8 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-700">

              <div className="flex items-center gap-3">

                <Mail
                  size={19}
                  className="text-slate-400 dark:text-slate-500"
                />

                <div>

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Correo electrónico
                  </p>

                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {usuario?.email || "Sin correo"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          <div className="lg:col-span-2">

            <div className="grid gap-5 sm:grid-cols-2">

              <DatoPerfil
                icono={<BriefcaseBusiness />}
                titulo="Postulaciones"
                valor={stats.total}
              />

              <DatoPerfil
                icono={<CalendarDays />}
                titulo="Entrevistas"
                valor={stats.entrevistas}
              />

              <DatoPerfil
                icono={<FileCode2 />}
                titulo="Pruebas técnicas"
                valor={stats.pruebasTecnicas}
              />

              <DatoPerfil
                icono={<CheckCircle2 />}
                titulo="Contrataciones"
                valor={stats.contratadas}
              />

            </div>

            <div className="mt-6 rounded-2xl bg-white p-7 shadow-sm transition-colors dark:bg-slate-800">

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Resumen de actividad
              </h2>

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                JobTrack Pro reúne tus procesos laborales para que puedas
                analizar tu progreso y mantener organizada tu búsqueda de empleo.
              </p>

              <div className="mt-6 rounded-xl bg-blue-50 p-5 dark:bg-blue-950/50">

                <p className="font-semibold text-blue-800 dark:text-blue-300">
                  Total de procesos registrados: {stats.total}
                </p>

                <p className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  Sigue actualizando los estados de tus postulaciones para
                  mantener tus estadísticas al día.
                </p>

              </div>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

function DatoPerfil({ icono, titulo, valor }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-slate-800">

      <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
        {icono}
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {valor || 0}
      </p>

    </div>
  );
}

export default Perfil;