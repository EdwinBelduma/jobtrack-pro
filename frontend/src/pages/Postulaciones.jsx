import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BriefcaseBusiness
} from "lucide-react";

function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  const cargarPostulaciones = async () => {
    try {
      const respuesta = await axios.get(
        "http://localhost:5000/api/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPostulaciones(respuesta.data);
    } catch (error) {
      console.error("Error al cargar postulaciones:", error);
    }
  };

  const eliminarPostulacion = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta postulación?"
    );

    if (!confirmar) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      cargarPostulaciones();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const postulacionesFiltradas = postulaciones.filter((postulacion) => {
    const coincideBusqueda =
      postulacion.empresa
        ?.toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      postulacion.cargo
        ?.toLowerCase()
        .includes(busqueda.toLowerCase());

    const coincideEstado =
      estado === "" || postulacion.estado === estado;

    return coincideBusqueda && coincideEstado;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>
            <p className="text-sm font-medium text-blue-600">
              Gestión
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Postulaciones
            </h1>

            <p className="mt-2 text-slate-500">
              Administra todos tus procesos de selección.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
            <Plus size={20} />
            Nueva postulación
          </button>

        </header>

        <section className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm md:flex-row">

          <div className="flex flex-1 items-center rounded-xl border border-slate-300 px-4">
            <Search size={19} className="text-slate-400" />

            <input
              type="text"
              placeholder="Buscar empresa o cargo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full border-0 bg-transparent px-3 py-3 outline-none"
            />
          </div>

          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="Enviado">Enviado</option>
            <option value="En revisión">En revisión</option>
            <option value="Prueba Técnica">Prueba Técnica</option>
            <option value="Entrevista">Entrevista</option>
            <option value="Oferta">Oferta</option>
            <option value="Contratado">Contratado</option>
            <option value="Rechazado">Rechazado</option>
          </select>

        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr className="text-left text-sm text-slate-500">

                  <th className="px-6 py-4">Empresa</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Modalidad</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Prioridad</th>
                  <th className="px-6 py-4">Acciones</th>

                </tr>

              </thead>

              <tbody>

                {postulacionesFiltradas.length > 0 ? (
                  postulacionesFiltradas.map((postulacion) => (

                    <tr
                      key={postulacion._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                            <BriefcaseBusiness size={20} />
                          </div>

                          <span className="font-semibold text-slate-900">
                            {postulacion.empresa}
                          </span>

                        </div>

                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {postulacion.cargo}
                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {postulacion.modalidad || "No especificada"}
                      </td>

                      <td className="px-6 py-5">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                          {postulacion.estado}
                        </span>

                      </td>

                      <td className="px-6 py-5 text-slate-600">
                        {postulacion.prioridad || "Media"}
                      </td>

                      <td className="px-6 py-5">

                        <div className="flex gap-2">

                          <button className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600">
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              eliminarPostulacion(postulacion._id)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))
                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center text-slate-400"
                    >
                      No hay postulaciones para mostrar.
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>

    </div>
  );
}

export default Postulaciones;