import { useEffect, useState } from "react";
import axios from "axios";
import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  FileCode2
} from "lucide-react";

function Empresas() {
  const [empresas, setEmpresas] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const agrupadas = {};

      respuesta.data.forEach((postulacion) => {
        const nombreEmpresa = postulacion.empresa || "Sin empresa";

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

        agrupadas[nombreEmpresa].postulaciones.push(postulacion);
      });

      setEmpresas(Object.values(agrupadas));

    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Organización
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Empresas
          </h1>

          <p className="mt-2 text-slate-500">
            Resumen de tus procesos de selección agrupados por empresa.
          </p>

        </header>

        {empresas.length > 0 ? (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {empresas.map((empresa) => (

              <div
                key={empresa.nombre}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >

                <div className="mb-6 flex items-center gap-4">

                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <Building2 size={26} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {empresa.nombre}
                    </h2>

                    <p className="text-sm text-slate-500">
                      {empresa.total}{" "}
                      {empresa.total === 1
                        ? "postulación"
                        : "postulaciones"}
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-3 gap-3">

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

                <div className="mt-6 border-t border-slate-100 pt-5">

                  <p className="mb-3 text-sm font-semibold text-slate-700">
                    Procesos
                  </p>

                  <div className="space-y-3">

                    {empresa.postulaciones.slice(0, 3).map((postulacion) => (

                      <div
                        key={postulacion._id}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-3"
                      >

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            {postulacion.cargo}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {postulacion.modalidad || "Sin modalidad"}
                          </p>

                        </div>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                          {postulacion.estado}
                        </span>

                      </div>

                    ))}

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <Building2
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No hay empresas registradas
            </h2>

            <p className="mt-2 text-slate-500">
              Las empresas aparecerán automáticamente cuando registres postulaciones.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

function MiniCard({ icono, titulo, valor }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <div className="text-blue-600">
        {icono}
      </div>

      <p className="mt-3 text-xl font-bold text-slate-900">
        {valor}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {titulo}
      </p>

    </div>
  );
}

export default Empresas;