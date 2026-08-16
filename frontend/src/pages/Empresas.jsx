import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  FileCode2,
  X,
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  UserRound,
  Clock3,
  Video,
  DollarSign
} from "lucide-react";

function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const respuesta = await api.get("/applications");

      const agrupadas = {};

      respuesta.data.forEach((postulacion) => {
        const nombreEmpresa =
          postulacion.empresa || "Sin empresa";

        if (!agrupadas[nombreEmpresa]) {
          agrupadas[nombreEmpresa] = {
            nombre: nombreEmpresa,
            total: 0,
            entrevistas: 0,
            pruebasTecnicas: 0,
            contratadas: 0,
            postulaciones: []
          };
        }

        agrupadas[nombreEmpresa].total += 1;

        if (postulacion.estado === "Entrevista") {
          agrupadas[nombreEmpresa].entrevistas += 1;
        }

        if (postulacion.estado === "Prueba Técnica") {
          agrupadas[nombreEmpresa].pruebasTecnicas += 1;
        }

        if (postulacion.estado === "Contratado") {
          agrupadas[nombreEmpresa].contratadas += 1;
        }

        agrupadas[nombreEmpresa].postulaciones.push(
          postulacion
        );
      });

      const listaEmpresas = Object.values(
        agrupadas
      ).sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      );

      setEmpresas(listaEmpresas);

    } catch (error) {
      console.error(
        "Error al cargar empresas:",
        error
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white sm:p-6 md:p-8">

      <div className="mx-auto w-full max-w-7xl">

        <header className="mb-6 sm:mb-8">

          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Organización
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Empresas
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
            Resumen de tus procesos de selección agrupados por empresa.
          </p>

        </header>

        {empresas.length > 0 ? (

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">

            {empresas.map((empresa) => (

              <div
                key={empresa.nombre}
                className="min-w-0 rounded-2xl bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800 sm:p-5 lg:p-6"
              >

                <div className="mb-5 flex min-w-0 items-start gap-3 sm:mb-6 sm:gap-4">

                  <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400 sm:p-3">
                    <Building2 size={24} />
                  </div>

                  <div className="min-w-0">

                    <h2 className="break-words text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
                      {empresa.nombre}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {empresa.total}{" "}
                      {empresa.total === 1
                        ? "postulación"
                        : "postulaciones"}
                    </p>

                  </div>

                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">

                  <MiniCard
                    icono={<CalendarDays size={18} />}
                    titulo="Entrevistas"
                    valor={empresa.entrevistas}
                  />

                  <MiniCard
                    icono={<FileCode2 size={18} />}
                    titulo="Pruebas"
                    valor={empresa.pruebasTecnicas}
                  />

                  <MiniCard
                    icono={<BriefcaseBusiness size={18} />}
                    titulo="Contratado"
                    valor={empresa.contratadas}
                  />

                </div>

                <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-700 sm:mt-6">

                  <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Procesos
                  </p>

                  <div className="space-y-3">

                    {empresa.postulaciones
                      .slice(0, 3)
                      .map((postulacion) => (

                        <div
                          key={postulacion._id}
                          className="flex min-w-0 items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 transition-colors dark:bg-slate-700"
                        >

                          <div className="min-w-0">

                            <p className="break-words text-sm font-semibold text-slate-800 dark:text-white">
                              {postulacion.cargo}
                            </p>

                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                              {postulacion.modalidad ||
                                "Sin modalidad"}
                            </p>

                          </div>

                          <span className="max-w-[45%] shrink-0 truncate rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {postulacion.estado}
                          </span>

                        </div>

                      ))}

                  </div>

                  <button
                    onClick={() =>
                      setEmpresaSeleccionada(empresa)
                    }
                    className="mt-5 w-full rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700"
                  >
                    Ver detalles
                  </button>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="rounded-2xl bg-white p-8 text-center shadow-sm transition-colors dark:bg-slate-800 sm:p-12">

            <Building2
              size={46}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white sm:text-xl">
              No hay empresas registradas
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
              Las empresas aparecerán automáticamente cuando registres postulaciones.
            </p>

          </div>

        )}

      </div>

      {empresaSeleccionada && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4">

          <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl dark:bg-slate-800 sm:rounded-3xl sm:p-6 md:p-7">

            <div className="mb-5 flex items-start justify-between gap-4 sm:mb-6">

              <div className="min-w-0">

                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Detalle de empresa
                </p>

                <h2 className="mt-1 break-words text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {empresaSeleccionada.nombre}
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {empresaSeleccionada.total} procesos registrados.
                </p>

              </div>

              <button
                onClick={() =>
                  setEmpresaSeleccionada(null)
                }
                className="shrink-0 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                aria-label="Cerrar detalle"
              >
                <X size={22} />
              </button>

            </div>

            <div className="space-y-4 sm:space-y-5">

              {empresaSeleccionada.postulaciones.map(
                (postulacion) => (

                  <div
                    key={postulacion._id}
                    className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-700 sm:p-5"
                  >

                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start sm:gap-4">

                      <div className="min-w-0">

                        <h3 className="break-words text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                          {postulacion.cargo}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {postulacion.modalidad ||
                            "Sin modalidad"}
                        </p>

                      </div>

                      <span className="w-fit max-w-full truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {postulacion.estado}
                      </span>

                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                      {postulacion.nivel && (
                        <Dato
                          icono={
                            <BriefcaseBusiness size={17} />
                          }
                          titulo="Nivel"
                          valor={postulacion.nivel}
                        />
                      )}

                      {(postulacion.salario ||
                        postulacion.salario === 0) && (
                        <Dato
                          icono={
                            <DollarSign size={17} />
                          }
                          titulo="Salario"
                          valor={`${postulacion.moneda || "USD"} ${postulacion.salario}`}
                        />
                      )}

                      {postulacion.ciudad && (
                        <Dato
                          icono={
                            <MapPin size={17} />
                          }
                          titulo="Ubicación"
                          valor={`${postulacion.ciudad}${
                            postulacion.pais
                              ? `, ${postulacion.pais}`
                              : ""
                          }`}
                        />
                      )}

                      {postulacion.fechaPostulacion && (
                        <Dato
                          icono={
                            <CalendarDays size={17} />
                          }
                          titulo="Fecha de postulación"
                          valor={new Date(
                            postulacion.fechaPostulacion
                          ).toLocaleDateString(
                            "es-EC"
                          )}
                        />
                      )}

                      {postulacion.fechaEntrevista && (
                        <Dato
                          icono={
                            <Clock3 size={17} />
                          }
                          titulo="Entrevista"
                          valor={new Date(
                            postulacion.fechaEntrevista
                          ).toLocaleString(
                            "es-EC"
                          )}
                        />
                      )}

                      {postulacion.plataformaEntrevista && (
                        <Dato
                          icono={
                            <Video size={17} />
                          }
                          titulo="Plataforma"
                          valor={
                            postulacion.plataformaEntrevista
                          }
                        />
                      )}

                      {postulacion.contactoEntrevista && (
                        <Dato
                          icono={
                            <UserRound size={17} />
                          }
                          titulo="Entrevistador"
                          valor={
                            postulacion.contactoEntrevista
                          }
                        />
                      )}

                      {postulacion.contactoRRHH && (
                        <Dato
                          icono={
                            <UserRound size={17} />
                          }
                          titulo="Contacto RR.HH."
                          valor={
                            postulacion.contactoRRHH
                          }
                        />
                      )}

                      {postulacion.correoRRHH && (
                        <Dato
                          icono={
                            <Mail size={17} />
                          }
                          titulo="Correo RR.HH."
                          valor={
                            postulacion.correoRRHH
                          }
                        />
                      )}

                      {postulacion.telefonoRRHH && (
                        <Dato
                          icono={
                            <Phone size={17} />
                          }
                          titulo="Teléfono RR.HH."
                          valor={
                            postulacion.telefonoRRHH
                          }
                        />
                      )}

                    </div>

                    {postulacion.tecnologias?.length > 0 && (

                      <div className="mt-5">

                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          Tecnologías
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">

                          {postulacion.tecnologias.map(
                            (tecnologia) => (

                              <span
                                key={tecnologia}
                                className="max-w-full break-words rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                              >
                                {tecnologia}
                              </span>

                            )
                          )}

                        </div>

                      </div>

                    )}

                    {postulacion.notasEntrevista && (

                      <div className="mt-5 rounded-xl bg-blue-50 p-3 dark:bg-blue-950/30 sm:p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
                          Notas de entrevista
                        </p>

                        <p className="mt-2 break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {postulacion.notasEntrevista}
                        </p>

                      </div>

                    )}

                    {postulacion.observaciones && (

                      <div className="mt-5 rounded-xl bg-slate-50 p-3 dark:bg-slate-700 sm:p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Observaciones
                        </p>

                        <p className="mt-2 break-words text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                          {postulacion.observaciones}
                        </p>

                      </div>

                    )}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                      {postulacion.enlaceEntrevista &&
                        postulacion.plataformaEntrevista !==
                          "Presencial" && (

                          <a
                            href={postulacion.enlaceEntrevista}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
                          >
                            <Video size={16} />
                            Abrir entrevista
                          </a>

                        )}

                      {postulacion.urlOferta && (

                        <a
                          href={postulacion.urlOferta}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-700 sm:w-auto"
                        >
                          <ExternalLink size={16} />
                          Ver oferta original
                        </a>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

function MiniCard({
  icono,
  titulo,
  valor
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-2.5 transition-colors dark:bg-slate-700 sm:p-3">

      <div className="text-blue-600 dark:text-blue-400">
        {icono}
      </div>

      <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white sm:mt-3 sm:text-xl">
        {valor}
      </p>

      <p className="mt-1 break-words text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs">
        {titulo}
      </p>

    </div>
  );
}

function Dato({
  icono,
  titulo,
  valor
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700/70">

      <span className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
        {icono}
      </span>

      <div className="min-w-0">

        <p className="text-xs text-slate-400">
          {titulo}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-slate-700 dark:text-slate-200">
          {valor}
        </p>

      </div>

    </div>
  );
}

export default Empresas;