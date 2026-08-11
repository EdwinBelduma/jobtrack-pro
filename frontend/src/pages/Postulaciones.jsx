import { useEffect, useState } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BriefcaseBusiness,
  X
} from "lucide-react";

function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [postulacionEditando, setPostulacionEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    empresa: "",
    cargo: "",
    modalidad: "Remoto",
    estado: "Enviado",
    prioridad: "Media",
    salario: "",
    ciudad: "",
    pais: "Ecuador",
    fechaEntrevista: "",
    observaciones: ""
  });

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

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      empresa: "",
      cargo: "",
      modalidad: "Remoto",
      estado: "Enviado",
      prioridad: "Media",
      salario: "",
      ciudad: "",
      pais: "Ecuador",
      fechaEntrevista: "",
      observaciones: ""
    });

    setModoEdicion(false);
    setPostulacionEditando(null);
  };

  const abrirNuevaPostulacion = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  const abrirEdicion = (postulacion) => {
    setModoEdicion(true);
    setPostulacionEditando(postulacion._id);

    setFormulario({
      empresa: postulacion.empresa || "",
      cargo: postulacion.cargo || "",
      modalidad: postulacion.modalidad || "Remoto",
      estado: postulacion.estado || "Enviado",
      prioridad: postulacion.prioridad || "Media",
      salario: postulacion.salario || "",
      ciudad: postulacion.ciudad || "",
      pais: postulacion.pais || "Ecuador",

      fechaEntrevista: postulacion.fechaEntrevista
        ? postulacion.fechaEntrevista.slice(0, 16)
        : "",

      observaciones: postulacion.observaciones || ""
    });

    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  const guardarPostulacion = async (e) => {
    e.preventDefault();

    try {
      const datos = {
        ...formulario,

        salario: formulario.salario
          ? Number(formulario.salario)
          : 0,

        fechaEntrevista:
          formulario.fechaEntrevista || null
      };

      if (modoEdicion) {
        await axios.put(
          `http://localhost:5000/api/applications/${postulacionEditando}`,
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/applications",
          datos,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }

      cerrarFormulario();
      cargarPostulaciones();

    } catch (error) {
      console.error("Error al guardar postulación:", error);

      alert(
        error.response?.data?.mensaje ||
          "No se pudo guardar la postulación"
      );
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

          <button
            onClick={abrirNuevaPostulacion}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
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
                  <th className="px-6 py-4">Entrevista</th>
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

                      <td className="px-6 py-5 text-sm text-slate-600">

                        {postulacion.fechaEntrevista
                          ? new Date(
                              postulacion.fechaEntrevista
                            ).toLocaleString("es-EC")
                          : "Sin fecha"}

                      </td>

                      <td className="px-6 py-5">

                        <div className="flex gap-2">

                          <button
                            onClick={() => abrirEdicion(postulacion)}
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              eliminarPostulacion(postulacion._id)
                            }
                            className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                            title="Eliminar"
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
                      colSpan="7"
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

      {mostrarFormulario && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-blue-600">
                  {modoEdicion
                    ? "Editar postulación"
                    : "Nueva postulación"}
                </p>

                <h2 className="text-2xl font-bold text-slate-900">
                  {modoEdicion
                    ? "Actualizar proceso laboral"
                    : "Registrar proceso laboral"}
                </h2>

              </div>

              <button
                onClick={cerrarFormulario}
                className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={22} />
              </button>

            </div>

            <form
              onSubmit={guardarPostulacion}
              className="grid gap-5 md:grid-cols-2"
            >

              <Campo
                label="Empresa"
                name="empresa"
                value={formulario.empresa}
                onChange={manejarCambio}
                placeholder="Ej. Devsu"
                required
              />

              <Campo
                label="Cargo"
                name="cargo"
                value={formulario.cargo}
                onChange={manejarCambio}
                placeholder="Ej. Backend Developer"
                required
              />

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Modalidad
                </label>

                <select
                  name="modalidad"
                  value={formulario.modalidad}
                  onChange={manejarCambio}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="Remoto">Remoto</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Presencial">Presencial</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Estado
                </label>

                <select
                  name="estado"
                  value={formulario.estado}
                  onChange={manejarCambio}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="Enviado">Enviado</option>
                  <option value="En revisión">En revisión</option>
                  <option value="Prueba Técnica">Prueba Técnica</option>
                  <option value="Entrevista">Entrevista</option>
                  <option value="Oferta">Oferta</option>
                  <option value="Contratado">Contratado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Prioridad
                </label>

                <select
                  name="prioridad"
                  value={formulario.prioridad}
                  onChange={manejarCambio}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>

              </div>

              <Campo
                label="Salario"
                name="salario"
                type="number"
                value={formulario.salario}
                onChange={manejarCambio}
                placeholder="Ej. 1200"
              />

              <Campo
                label="Ciudad"
                name="ciudad"
                value={formulario.ciudad}
                onChange={manejarCambio}
                placeholder="Ej. Quito"
              />

              <Campo
                label="País"
                name="pais"
                value={formulario.pais}
                onChange={manejarCambio}
                placeholder="Ecuador"
              />

              <Campo
                label="Fecha de entrevista"
                name="fechaEntrevista"
                type="datetime-local"
                value={formulario.fechaEntrevista}
                onChange={manejarCambio}
              />

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Observaciones
                </label>

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={manejarCambio}
                  rows="4"
                  placeholder="Notas sobre entrevista, prueba técnica, contacto..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                />

              </div>

              <div className="flex justify-end gap-3 md:col-span-2">

                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  {modoEdicion
                    ? "Guardar cambios"
                    : "Guardar postulación"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

function Campo({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
      />

    </div>
  );
}

export default Postulaciones;