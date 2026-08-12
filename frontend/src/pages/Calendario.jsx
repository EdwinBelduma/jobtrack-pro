import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  CalendarDays,
  Clock3,
  BriefcaseBusiness,
  Video,
  ExternalLink,
  UserRound,
  StickyNote
} from "lucide-react";

function Calendario() {
  const [entrevistas, setEntrevistas] = useState([]);

  useEffect(() => {
    cargarEntrevistas();
  }, []);

  const cargarEntrevistas = async () => {
    try {
      const respuesta = await api.get(
        "/applications"
      );

      const entrevistasConFecha = respuesta.data
        .filter(
          (postulacion) =>
            postulacion.fechaEntrevista
        )
        .sort(
          (a, b) =>
            new Date(a.fechaEntrevista) -
            new Date(b.fechaEntrevista)
        );

      setEntrevistas(entrevistasConFecha);

    } catch (error) {
      console.error(
        "Error al cargar entrevistas:",
        error
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white md:p-8">

      <div className="mx-auto max-w-7xl">

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Agenda
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            Calendario de entrevistas
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Consulta todas tus entrevistas programadas y su información.
          </p>

        </header>

        {entrevistas.length > 0 ? (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {entrevistas.map((entrevista) => {

              const fecha = new Date(
                entrevista.fechaEntrevista
              );

              return (
                <div
                  key={entrevista._id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">

                      <CalendarDays size={24} />

                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {entrevista.estado}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <BriefcaseBusiness
                      size={20}
                      className="text-slate-400 dark:text-slate-500"
                    />

                    <div>

                      <h2 className="font-bold text-slate-900 dark:text-white">
                        {entrevista.empresa}
                      </h2>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {entrevista.cargo}
                      </p>

                    </div>

                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">

                      <CalendarDays
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />

                      {fecha.toLocaleDateString(
                        "es-EC",
                        {
                          weekday: "long",
                          day: "2-digit",
                          month: "long",
                          year: "numeric"
                        }
                      )}

                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">

                      <Clock3
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />

                      {fecha.toLocaleTimeString(
                        "es-EC",
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}

                    </div>

                    {entrevista.plataformaEntrevista && (

                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">

                        <Video
                          size={18}
                          className="text-blue-600 dark:text-blue-400"
                        />

                        {entrevista.plataformaEntrevista}

                      </div>

                    )}

                    {entrevista.contactoEntrevista && (

                      <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">

                        <UserRound
                          size={18}
                          className="text-blue-600 dark:text-blue-400"
                        />

                        {entrevista.contactoEntrevista}

                      </div>

                    )}

                  </div>

                  {entrevista.notasEntrevista && (

                    <div className="mt-5 rounded-xl bg-slate-50 p-4 dark:bg-slate-700">

                      <div className="flex items-start gap-3">

                        <StickyNote
                          size={18}
                          className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
                        />

                        <div>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Notas
                          </p>

                          <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                            {entrevista.notasEntrevista}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}

                  {entrevista.enlaceEntrevista && (

                    <a
                      href={entrevista.enlaceEntrevista}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      <ExternalLink size={18} />

                      Abrir reunión
                    </a>

                  )}

                </div>
              );
            })}

          </div>

        ) : (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm transition-colors dark:bg-slate-800">

            <CalendarDays
              size={48}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white">
              No tienes entrevistas programadas
            </h2>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Cuando agregues una fecha de entrevista,
              aparecerá aquí automáticamente.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Calendario;