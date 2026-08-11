import { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Clock3,
  BriefcaseBusiness
} from "lucide-react";

function Calendario() {
  const [entrevistas, setEntrevistas] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarEntrevistas();
  }, []);

  const cargarEntrevistas = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const entrevistasConFecha = respuesta.data
        .filter((postulacion) => postulacion.fechaEntrevista)
        .sort(
          (a, b) =>
            new Date(a.fechaEntrevista) -
            new Date(b.fechaEntrevista)
        );

      setEntrevistas(entrevistasConFecha);

    } catch (error) {
      console.error("Error al cargar entrevistas:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      <div className="mx-auto max-w-6xl">

        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Agenda
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Calendario de entrevistas
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta todas tus entrevistas programadas.
          </p>
        </header>

        {entrevistas.length > 0 ? (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {entrevistas.map((entrevista) => {

              const fecha = new Date(
                entrevista.fechaEntrevista
              );

              return (
                <div
                  key={entrevista._id}
                  className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="mb-5 flex items-center justify-between">

                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                      <CalendarDays size={24} />
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {entrevista.estado}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <BriefcaseBusiness
                      size={20}
                      className="text-slate-400"
                    />

                    <div>
                      <h2 className="font-bold text-slate-900">
                        {entrevista.empresa}
                      </h2>

                      <p className="text-sm text-slate-500">
                        {entrevista.cargo}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarDays size={18} />

                      {fecha.toLocaleDateString("es-EC", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Clock3 size={18} />

                      {fecha.toLocaleTimeString("es-EC", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">

            <CalendarDays
              size={48}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No tienes entrevistas programadas
            </h2>

            <p className="mt-2 text-slate-500">
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