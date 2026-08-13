import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  CalendarDays,
  Clock3,
  BriefcaseBusiness,
  Video,
  ExternalLink,
  UserRound,
  StickyNote,
  MapPin
} from "lucide-react";

function Calendario() {
  const [entrevistas, setEntrevistas] = useState([]);

  useEffect(() => {
    cargarEntrevistas();
  }, []);

  const cargarEntrevistas = async () => {
    try {
      const respuesta = await api.get("/applications");

      const entrevistasConFecha = respuesta.data
        .filter((postulacion) => postulacion.fechaEntrevista)
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

  const ahora = new Date();

  const proximasEntrevistas = entrevistas.filter(
    (entrevista) =>
      new Date(entrevista.fechaEntrevista) >= ahora
  );

  const entrevistasAnteriores = entrevistas
    .filter(
      (entrevista) =>
        new Date(entrevista.fechaEntrevista) < ahora
    )
    .sort(
      (a, b) =>
        new Date(b.fechaEntrevista) -
        new Date(a.fechaEntrevista)
    );

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
            Consulta tus entrevistas próximas y revisa las anteriores.
          </p>

        </header>

        <SeccionEntrevistas
          titulo="Próximas entrevistas"
          descripcion="Entrevistas que todavía están pendientes."
          entrevistas={proximasEntrevistas}
          vacio="No tienes entrevistas próximas."
          esPasada={false}
        />

        <div className="mt-8">

          <SeccionEntrevistas
            titulo="Entrevistas anteriores"
            descripcion="Historial de entrevistas cuya fecha ya pasó."
            entrevistas={entrevistasAnteriores}
            vacio="Todavía no tienes entrevistas anteriores."
            esPasada={true}
          />

        </div>

      </div>

    </div>
  );
}

function SeccionEntrevistas({
  titulo,
  descripcion,
  entrevistas,
  vacio,
  esPasada
}) {
  return (
    <section className="rounded-3xl bg-white/50 p-5 shadow-sm transition-colors dark:bg-slate-800/50">

      <div className="mb-5 flex items-start justify-between gap-4">

        <div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {titulo}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {descripcion}
          </p>

        </div>


      </div>

      {entrevistas.length > 0 ? (

        <div className="max-h-[620px] overflow-y-auto pr-2">

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {entrevistas.map((entrevista) => (

              <TarjetaEntrevista
                key={entrevista._id}
                entrevista={entrevista}
                esPasada={esPasada}
              />

            ))}

          </div>

        </div>

      ) : (

        <div className="rounded-2xl bg-white p-10 text-center shadow-sm transition-colors dark:bg-slate-800">

          <CalendarDays
            size={42}
            className="mx-auto text-slate-300 dark:text-slate-600"
          />

          <p className="mt-4 text-slate-500 dark:text-slate-400">
            {vacio}
          </p>

        </div>

      )}

    </section>
  );
}

function TarjetaEntrevista({
  entrevista,
  esPasada
}) {
  const fecha = new Date(
    entrevista.fechaEntrevista
  );

  const esPresencial =
    entrevista.plataformaEntrevista === "Presencial";

  const tieneEnlace =
    entrevista.enlaceEntrevista &&
    entrevista.enlaceEntrevista.trim() !== "";

  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 ${
        esPasada ? "opacity-80" : ""
      }`}
    >

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
          <CalendarDays size={24} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            esPasada
              ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
          }`}
        >
          {esPasada
            ? "Finalizada"
            : entrevista.estado}
        </span>

      </div>

      <div className="flex items-center gap-3">

        <BriefcaseBusiness
          size={20}
          className="text-slate-400 dark:text-slate-500"
        />

        <div>

          <h3 className="font-bold text-slate-900 dark:text-white">
            {entrevista.empresa}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {entrevista.cargo}
          </p>

        </div>

      </div>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-5 dark:border-slate-700">

        <Dato
          icono={<CalendarDays size={18} />}
        >
          {fecha.toLocaleDateString(
            "es-EC",
            {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric"
            }
          )}
        </Dato>

        <Dato
          icono={<Clock3 size={18} />}
        >
          {fecha.toLocaleTimeString(
            "es-EC",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )}
        </Dato>

        {entrevista.plataformaEntrevista && (

          <Dato
            icono={<Video size={18} />}
          >
            {entrevista.plataformaEntrevista}
          </Dato>

        )}

        {esPresencial && (

          <Dato
            icono={<MapPin size={18} />}
          >
            {entrevista.ciudad ||
              "Ubicación no especificada"}

            {entrevista.pais
              ? `, ${entrevista.pais}`
              : ""}
          </Dato>

        )}

        {entrevista.contactoEntrevista && (

          <Dato
            icono={<UserRound size={18} />}
          >
            {entrevista.contactoEntrevista}
          </Dato>

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

      {!esPasada &&
        !esPresencial &&
        tieneEnlace && (

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

      {esPresencial && !esPasada && (

        <div className="mt-5 rounded-xl bg-amber-50 p-3 text-center text-sm font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
          Entrevista presencial
        </div>

      )}

    </div>
  );
}

function Dato({
  icono,
  children
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">

      <span className="shrink-0 text-blue-600 dark:text-blue-400">
        {icono}
      </span>

      <span>
        {children}
      </span>

    </div>
  );
}

export default Calendario;