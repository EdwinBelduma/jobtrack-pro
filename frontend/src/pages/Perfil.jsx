import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  User,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  FileCode2,
  CheckCircle2
} from "lucide-react";

function Perfil() {
  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  const [stats, setStats] = useState({
    total: 0,
    entrevistas: 0,
    pruebasTecnicas: 0,
    contratadas: 0
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const respuesta = await api.get(
          "/applications/stats"
        );

        setStats(respuesta.data);

      } catch (error) {
        console.error(
          "Error al cargar estadísticas:",
          error
        );
      }
    };

    cargarEstadisticas();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white sm:p-6 md:p-8">

      <div className="mx-auto w-full max-w-6xl">

        <header className="mb-6 sm:mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Cuenta
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Mi perfil
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Información de tu cuenta y actividad en JobTrack Pro.
          </p>

        </header>

        <section className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3">

          {/* DATOS DEL USUARIO */}
          <div className="rounded-2xl bg-white p-5 shadow-sm transition-colors dark:bg-slate-800 sm:p-6 lg:p-7">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 sm:h-24 sm:w-24">

                <User
                  size={38}
                  className="sm:hidden"
                />

                <User
                  size={42}
                  className="hidden sm:block"
                />

              </div>

              <h2 className="mt-4 break-words text-xl font-bold text-slate-900 dark:text-white sm:mt-5 sm:text-2xl">
                {usuario?.nombre || "Usuario"}
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Usuario de JobTrack Pro
              </p>

            </div>

            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-slate-700 sm:mt-8 sm:pt-6">

              <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/70">

                <Mail
                  size={19}
                  className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                />

                <div className="min-w-0">

                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Correo electrónico
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-slate-700 dark:text-slate-200">
                    {usuario?.email || "Sin correo"}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ESTADÍSTICAS Y RESUMEN */}
          <div className="min-w-0 lg:col-span-2">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">

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

            <div className="mt-5 rounded-2xl bg-white p-5 shadow-sm transition-colors dark:bg-slate-800 sm:mt-6 sm:p-6 lg:p-7">

              <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                Resumen de actividad
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400 sm:text-base">
                JobTrack Pro reúne tus procesos laborales para que puedas
                analizar tu progreso y mantener organizada tu búsqueda de empleo.
              </p>

              <div className="mt-5 rounded-xl bg-blue-50 p-4 dark:bg-blue-950/50 sm:mt-6 sm:p-5">

                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 sm:text-base">
                  Total de procesos registrados: {stats.total}
                </p>

                <p className="mt-2 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
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

function DatoPerfil({
  icono,
  titulo,
  valor
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 sm:p-6">

      <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
        {icono}
      </div>

      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400 sm:mt-5">
        {titulo}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
        {valor || 0}
      </p>

    </div>
  );
}

export default Perfil;