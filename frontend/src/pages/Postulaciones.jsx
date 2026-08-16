import { useEffect, useState } from "react";
import api from "../api/axios";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  BriefcaseBusiness,
  X,
  Video,
  Link as LinkIcon,
  UserRound,
  Mail,
  Phone,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CalendarDays,
  MapPin,
  Layers3,
  Flag
} from "lucide-react";

function Postulaciones() {
  const [postulaciones, setPostulaciones] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [modalidadFiltro, setModalidadFiltro] = useState("");
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [nivelFiltro, setNivelFiltro] = useState("");

  const [orden, setOrden] = useState("recientes");

  const [paginaActual, setPaginaActual] = useState(1);

  const postulacionesPorPagina = 10;

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [postulacionEditando, setPostulacionEditando] = useState(null);

  const formularioInicial = {
    empresa: "",
    cargo: "",
    modalidad: "Remoto",
    nivel: "Junior",
    estado: "Enviado",
    prioridad: "Media",

    salario: "",
    moneda: "USD",

    ciudad: "",
    pais: "Ecuador",

    tecnologias: "",
    urlOferta: "",

    contactoRRHH: "",
    correoRRHH: "",
    telefonoRRHH: "",

    fechaEntrevista: "",
    plataformaEntrevista: "",
    enlaceEntrevista: "",
    contactoEntrevista: "",
    notasEntrevista: "",

    observaciones: ""
  };

  const [formulario, setFormulario] = useState(formularioInicial);

  useEffect(() => {
    cargarPostulaciones();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [
    busqueda,
    estado,
    modalidadFiltro,
    prioridadFiltro,
    nivelFiltro,
    orden
  ]);

  const cargarPostulaciones = async () => {
    try {
      const respuesta = await api.get("/applications");

      setPostulaciones(respuesta.data);
    } catch (error) {
      console.error(
        "Error al cargar postulaciones:",
        error
      );
    }
  };

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setModoEdicion(false);
    setPostulacionEditando(null);
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstado("");
    setModalidadFiltro("");
    setPrioridadFiltro("");
    setNivelFiltro("");
    setOrden("recientes");
    setPaginaActual(1);
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
      nivel: postulacion.nivel || "Junior",
      estado: postulacion.estado || "Enviado",
      prioridad: postulacion.prioridad || "Media",

      salario: postulacion.salario ?? "",
      moneda: postulacion.moneda || "USD",

      ciudad: postulacion.ciudad || "",
      pais: postulacion.pais || "Ecuador",

      tecnologias:
        postulacion.tecnologias?.join(", ") || "",

      urlOferta:
        postulacion.urlOferta || "",

      contactoRRHH:
        postulacion.contactoRRHH || "",

      correoRRHH:
        postulacion.correoRRHH || "",

      telefonoRRHH:
        postulacion.telefonoRRHH || "",

      fechaEntrevista:
        postulacion.fechaEntrevista
          ? postulacion.fechaEntrevista.slice(0, 16)
          : "",

      plataformaEntrevista:
        postulacion.plataformaEntrevista || "",

      enlaceEntrevista:
        postulacion.enlaceEntrevista || "",

      contactoEntrevista:
        postulacion.contactoEntrevista || "",

      notasEntrevista:
        postulacion.notasEntrevista || "",

      observaciones:
        postulacion.observaciones || ""
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

        salario:
          formulario.salario !== ""
            ? Number(formulario.salario)
            : 0,

        tecnologias: formulario.tecnologias
          .split(",")
          .map((tecnologia) => tecnologia.trim())
          .filter(Boolean),

        fechaEntrevista:
          formulario.fechaEntrevista || null
      };

      if (modoEdicion) {
        await api.put(
          `/applications/${postulacionEditando}`,
          datos
        );
      } else {
        await api.post(
          "/applications",
          datos
        );
      }

      cerrarFormulario();
      await cargarPostulaciones();

    } catch (error) {
      console.error(
        "Error al guardar postulación:",
        error
      );

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
      await api.delete(`/applications/${id}`);
      await cargarPostulaciones();

    } catch (error) {
      console.error(
        "Error al eliminar:",
        error
      );
    }
  };

  const postulacionesFiltradas = postulaciones.filter(
    (postulacion) => {
      const textoBusqueda = busqueda
        .trim()
        .toLowerCase();

      const coincideBusqueda =
        textoBusqueda === "" ||
        postulacion.empresa
          ?.toLowerCase()
          .includes(textoBusqueda) ||
        postulacion.cargo
          ?.toLowerCase()
          .includes(textoBusqueda);

      const coincideEstado =
        estado === "" ||
        postulacion.estado === estado;

      const coincideModalidad =
        modalidadFiltro === "" ||
        postulacion.modalidad === modalidadFiltro;

      const coincidePrioridad =
        prioridadFiltro === "" ||
        postulacion.prioridad === prioridadFiltro;

      const coincideNivel =
        nivelFiltro === "" ||
        postulacion.nivel === nivelFiltro;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideModalidad &&
        coincidePrioridad &&
        coincideNivel
      );
    }
  );

  const postulacionesOrdenadas = [
    ...postulacionesFiltradas
  ].sort((a, b) => {
    switch (orden) {
      case "antiguas":
        return (
          new Date(a.fechaPostulacion || a.createdAt) -
          new Date(b.fechaPostulacion || b.createdAt)
        );

      case "empresaAZ":
        return (a.empresa || "").localeCompare(
          b.empresa || "",
          "es",
          { sensitivity: "base" }
        );

      case "empresaZA":
        return (b.empresa || "").localeCompare(
          a.empresa || "",
          "es",
          { sensitivity: "base" }
        );

      case "salarioMayor":
        return (
          Number(b.salario || 0) -
          Number(a.salario || 0)
        );

      case "salarioMenor":
        return (
          Number(a.salario || 0) -
          Number(b.salario || 0)
        );

      case "prioridad": {
        const prioridades = {
          Alta: 1,
          Media: 2,
          Baja: 3
        };

        return (
          (prioridades[a.prioridad] || 4) -
          (prioridades[b.prioridad] || 4)
        );
      }

      case "recientes":
      default:
        return (
          new Date(b.fechaPostulacion || b.createdAt) -
          new Date(a.fechaPostulacion || a.createdAt)
        );
    }
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(
      postulacionesOrdenadas.length /
      postulacionesPorPagina
    )
  );

  const paginaSegura = Math.min(
    paginaActual,
    totalPaginas
  );

  const indiceInicial =
    (paginaSegura - 1) *
    postulacionesPorPagina;

  const indiceFinal =
    indiceInicial +
    postulacionesPorPagina;

  const postulacionesPaginadas =
    postulacionesOrdenadas.slice(
      indiceInicial,
      indiceFinal
    );

  const hayFiltrosActivos =
    busqueda !== "" ||
    estado !== "" ||
    modalidadFiltro !== "" ||
    prioridadFiltro !== "" ||
    nivelFiltro !== "" ||
    orden !== "recientes";

  const irPaginaAnterior = () => {
    setPaginaActual((pagina) =>
      Math.max(1, pagina - 1)
    );
  };

  const irPaginaSiguiente = () => {
    setPaginaActual((pagina) =>
      Math.min(totalPaginas, pagina + 1)
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white sm:p-6 md:p-8">

      <div className="mx-auto max-w-7xl">

        <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

          <div>

            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Gestión
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              Postulaciones
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Administra todos tus procesos de selección.
            </p>

          </div>

          <button
            onClick={abrirNuevaPostulacion}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 md:w-auto"
          >
            <Plus size={20} />
            Nueva postulación
          </button>

        </header>

        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm transition-colors dark:bg-slate-800 sm:p-5">

          <div className="flex items-center rounded-xl border border-slate-300 px-4 dark:border-slate-600">

            <Search
              size={19}
              className="shrink-0 text-slate-400"
            />

            <input
              type="text"
              placeholder="Buscar por empresa o cargo..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              className="min-w-0 w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />

          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <select
              value={estado}
              onChange={(e) =>
                setEstado(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
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

            <select
              value={modalidadFiltro}
              onChange={(e) =>
                setModalidadFiltro(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">
                Todas las modalidades
              </option>
              <option value="Remoto">Remoto</option>
              <option value="Híbrido">Híbrido</option>
              <option value="Presencial">Presencial</option>
            </select>

            <select
              value={prioridadFiltro}
              onChange={(e) =>
                setPrioridadFiltro(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">
                Todas las prioridades
              </option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            <select
              value={nivelFiltro}
              onChange={(e) =>
                setNivelFiltro(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
            >
              <option value="">
                Todos los niveles
              </option>
              <option value="Practicante">Practicante</option>
              <option value="Junior">Junior</option>
              <option value="Semi Senior">Semi Senior</option>
              <option value="Senior">Senior</option>
            </select>

          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="flex items-center gap-2">

                <ArrowUpDown
                  size={18}
                  className="shrink-0 text-slate-400"
                />

                <select
                  value={orden}
                  onChange={(e) =>
                    setOrden(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white sm:w-auto"
                >
                  <option value="recientes">
                    Más recientes
                  </option>
                  <option value="antiguas">
                    Más antiguas
                  </option>
                  <option value="empresaAZ">
                    Empresa A - Z
                  </option>
                  <option value="empresaZA">
                    Empresa Z - A
                  </option>
                  <option value="salarioMayor">
                    Mayor salario
                  </option>
                  <option value="salarioMenor">
                    Menor salario
                  </option>
                  <option value="prioridad">
                    Prioridad alta primero
                  </option>
                </select>

              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400">

                Mostrando{" "}

                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {postulacionesOrdenadas.length === 0
                    ? 0
                    : indiceInicial + 1}
                </span>

                {" - "}

                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {Math.min(
                    indiceFinal,
                    postulacionesOrdenadas.length
                  )}
                </span>

                {" de "}

                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {postulacionesOrdenadas.length}
                </span>

                {" resultados"}

              </p>

            </div>

            {hayFiltrosActivos && (

              <button
                type="button"
                onClick={limpiarFiltros}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <RotateCcw size={16} />
                Limpiar filtros
              </button>

            )}

          </div>

        </section>

        {/* VISTA MÓVIL */}
        <section className="space-y-4 lg:hidden">

          {postulacionesPaginadas.length > 0 ? (

            postulacionesPaginadas.map((postulacion) => (

              <div
                key={postulacion._id}
                className="rounded-2xl bg-white p-5 shadow-sm transition-colors dark:bg-slate-800"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="flex min-w-0 items-start gap-3">

                    <div className="shrink-0 rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                      <BriefcaseBusiness size={20} />
                    </div>

                    <div className="min-w-0">

                      <h2 className="truncate font-bold text-slate-900 dark:text-white">
                        {postulacion.empresa}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {postulacion.cargo}
                      </p>

                    </div>

                  </div>

                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {postulacion.estado}
                  </span>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <DatoMovil
                    icono={<MapPin size={16} />}
                    titulo="Modalidad"
                    valor={
                      postulacion.modalidad ||
                      "No especificada"
                    }
                  />

                  <DatoMovil
                    icono={<Layers3 size={16} />}
                    titulo="Nivel"
                    valor={
                      postulacion.nivel ||
                      "No especificado"
                    }
                  />

                  <DatoMovil
                    icono={<Flag size={16} />}
                    titulo="Prioridad"
                    valor={
                      postulacion.prioridad ||
                      "Media"
                    }
                  />

                  <DatoMovil
                    icono={<CalendarDays size={16} />}
                    titulo="Entrevista"
                    valor={
                      postulacion.fechaEntrevista
                        ? new Date(
                            postulacion.fechaEntrevista
                          ).toLocaleDateString(
                            "es-EC",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }
                          )
                        : "Sin fecha"
                    }
                  />

                </div>

                {postulacion.fechaEntrevista && (

                  <div className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">

                    Entrevista:{" "}

                    <span className="font-semibold">
                      {new Date(
                        postulacion.fechaEntrevista
                      ).toLocaleString(
                        "es-EC",
                        {
                          dateStyle: "medium",
                          timeStyle: "short"
                        }
                      )}
                    </span>

                  </div>

                )}

                <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">

                  <button
                    onClick={() =>
                      abrirEdicion(postulacion)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-slate-700"
                  >
                    <Pencil size={17} />
                    Editar
                  </button>

                  <button
                    onClick={() =>
                      eliminarPostulacion(
                        postulacion._id
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <Trash2 size={17} />
                    Eliminar
                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm dark:bg-slate-800">

              <Search
                size={38}
                className="mx-auto text-slate-300 dark:text-slate-600"
              />

              <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
                No encontramos postulaciones
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Prueba cambiando o limpiando los filtros.
              </p>

            </div>

          )}

        </section>

        {/* VISTA ESCRITORIO */}
        <section className="hidden overflow-hidden rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-800 lg:block">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-700">

                <tr className="text-left text-sm text-slate-500 dark:text-slate-300">

                  <th className="px-6 py-4">
                    Empresa
                  </th>

                  <th className="px-6 py-4">
                    Cargo
                  </th>

                  <th className="px-6 py-4">
                    Modalidad
                  </th>

                  <th className="px-6 py-4">
                    Nivel
                  </th>

                  <th className="px-6 py-4">
                    Estado
                  </th>

                  <th className="px-6 py-4">
                    Prioridad
                  </th>

                  <th className="px-6 py-4">
                    Entrevista
                  </th>

                  <th className="px-6 py-4">
                    Acciones
                  </th>

                </tr>

              </thead>

              <tbody>

                {postulacionesPaginadas.length > 0 ? (

                  postulacionesPaginadas.map(
                    (postulacion) => (

                      <tr
                        key={postulacion._id}
                        className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/70"
                      >

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
                              <BriefcaseBusiness size={20} />
                            </div>

                            <span className="font-semibold text-slate-900 dark:text-white">
                              {postulacion.empresa}
                            </span>

                          </div>

                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                          {postulacion.cargo}
                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                          {postulacion.modalidad ||
                            "No especificada"}
                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                          {postulacion.nivel ||
                            "No especificado"}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {postulacion.estado}
                          </span>

                        </td>

                        <td className="px-6 py-5 text-slate-600 dark:text-slate-300">
                          {postulacion.prioridad ||
                            "Media"}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">

                          {postulacion.fechaEntrevista
                            ? new Date(
                                postulacion.fechaEntrevista
                              ).toLocaleString("es-EC")
                            : "Sin fecha"}

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex gap-2">

                            <button
                              onClick={() =>
                                abrirEdicion(postulacion)
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-blue-400"
                              title="Editar"
                            >
                              <Pencil size={18} />
                            </button>

                            <button
                              onClick={() =>
                                eliminarPostulacion(
                                  postulacion._id
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="8"
                      className="px-6 py-16 text-center"
                    >

                      <Search
                        size={38}
                        className="mx-auto text-slate-300 dark:text-slate-600"
                      />

                      <p className="mt-3 font-semibold text-slate-700 dark:text-slate-300">
                        No encontramos postulaciones
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Prueba cambiando o limpiando los filtros.
                      </p>

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </section>

        {postulacionesOrdenadas.length > 0 && (

          <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-slate-800 sm:flex-row sm:px-6">

            <button
              type="button"
              onClick={irPaginaAnterior}
              disabled={paginaSegura === 1}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 sm:w-auto"
            >
              <ChevronLeft size={17} />
              Anterior
            </button>

            <p className="text-sm text-slate-500 dark:text-slate-400">

              Página{" "}

              <span className="font-semibold text-slate-800 dark:text-white">
                {paginaSegura}
              </span>

              {" de "}

              <span className="font-semibold text-slate-800 dark:text-white">
                {totalPaginas}
              </span>

            </p>

            <button
              type="button"
              onClick={irPaginaSiguiente}
              disabled={
                paginaSegura === totalPaginas
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700 sm:w-auto"
            >
              Siguiente
              <ChevronRight size={17} />
            </button>

          </div>

        )}

      </div>

      {mostrarFormulario && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4">

          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 text-slate-900 shadow-2xl dark:bg-slate-800 dark:text-white sm:rounded-3xl sm:p-7">

            <div className="mb-6 flex items-start justify-between gap-4">

              <div>

                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {modoEdicion
                    ? "Editar postulación"
                    : "Nueva postulación"}
                </p>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {modoEdicion
                    ? "Actualizar proceso laboral"
                    : "Registrar proceso laboral"}
                </h2>

              </div>

              <button
                onClick={cerrarFormulario}
                className="shrink-0 rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
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

              <SelectCampo
                label="Modalidad"
                name="modalidad"
                value={formulario.modalidad}
                onChange={manejarCambio}
                opciones={[
                  "Remoto",
                  "Híbrido",
                  "Presencial"
                ]}
              />

              <SelectCampo
                label="Nivel"
                name="nivel"
                value={formulario.nivel}
                onChange={manejarCambio}
                opciones={[
                  "Practicante",
                  "Junior",
                  "Semi Senior",
                  "Senior"
                ]}
              />

              <SelectCampo
                label="Estado"
                name="estado"
                value={formulario.estado}
                onChange={manejarCambio}
                opciones={[
                  "Enviado",
                  "En revisión",
                  "Prueba Técnica",
                  "Entrevista",
                  "Oferta",
                  "Contratado",
                  "Rechazado"
                ]}
              />

              <SelectCampo
                label="Prioridad"
                name="prioridad"
                value={formulario.prioridad}
                onChange={manejarCambio}
                opciones={[
                  "Alta",
                  "Media",
                  "Baja"
                ]}
              />

              <Campo
                label="Salario"
                name="salario"
                type="number"
                value={formulario.salario}
                onChange={manejarCambio}
                placeholder="Ej. 1200"
              />

              <SelectCampo
                label="Moneda"
                name="moneda"
                value={formulario.moneda}
                onChange={manejarCambio}
                opciones={[
                  "USD",
                  "EUR",
                  "COP",
                  "PEN",
                  "MXN",
                  "Otra"
                ]}
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

              <div className="md:col-span-2">

                <Campo
                  label="Tecnologías"
                  name="tecnologias"
                  value={formulario.tecnologias}
                  onChange={manejarCambio}
                  placeholder="Ej. React, Node.js, MongoDB, Docker"
                />

                <p className="mt-2 text-xs text-slate-400">
                  Separa las tecnologías con comas.
                </p>

              </div>

              <div className="md:col-span-2">

                <CampoIcono
                  label="URL de la oferta"
                  name="urlOferta"
                  type="url"
                  value={formulario.urlOferta}
                  onChange={manejarCambio}
                  placeholder="https://empresa.com/oferta..."
                  icono={<LinkIcon size={18} />}
                />

              </div>

              <SeccionTitulo
                etiqueta="Empresa"
                titulo="Contacto de Recursos Humanos"
              />

              <CampoIcono
                label="Contacto RR.HH."
                name="contactoRRHH"
                value={formulario.contactoRRHH}
                onChange={manejarCambio}
                placeholder="Ej. Ana Pérez"
                icono={<UserRound size={18} />}
              />

              <CampoIcono
                label="Correo RR.HH."
                name="correoRRHH"
                type="email"
                value={formulario.correoRRHH}
                onChange={manejarCambio}
                placeholder="ana@empresa.com"
                icono={<Mail size={18} />}
              />

              <CampoIcono
                label="Teléfono RR.HH."
                name="telefonoRRHH"
                type="tel"
                value={formulario.telefonoRRHH}
                onChange={manejarCambio}
                placeholder="Ej. 0999999999"
                icono={<Phone size={18} />}
              />

              <SeccionTitulo
                etiqueta="Información de entrevista"
                titulo="Datos de la entrevista"
              />

              <Campo
                label="Fecha de entrevista"
                name="fechaEntrevista"
                type="datetime-local"
                value={formulario.fechaEntrevista}
                onChange={manejarCambio}
              />

              <SelectCampo
                label="Plataforma"
                name="plataformaEntrevista"
                value={formulario.plataformaEntrevista}
                onChange={manejarCambio}
                opciones={[
                  "",
                  "Google Meet",
                  "Zoom",
                  "Microsoft Teams",
                  "Presencial",
                  "Llamada telefónica",
                  "Otra"
                ]}
                opcionVacia="Seleccionar plataforma"
              />

              <CampoIcono
                label="Enlace de entrevista"
                name="enlaceEntrevista"
                type="url"
                value={formulario.enlaceEntrevista}
                onChange={manejarCambio}
                placeholder="https://meet.google.com/..."
                icono={<LinkIcon size={18} />}
              />

              <CampoIcono
                label="Contacto / entrevistador"
                name="contactoEntrevista"
                value={formulario.contactoEntrevista}
                onChange={manejarCambio}
                placeholder="Ej. María López"
                icono={<UserRound size={18} />}
              />

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Notas para la entrevista
                </label>

                <div className="relative">

                  <Video
                    size={18}
                    className="absolute left-4 top-4 text-slate-400"
                  />

                  <textarea
                    name="notasEntrevista"
                    value={formulario.notasEntrevista}
                    onChange={manejarCambio}
                    rows="4"
                    placeholder="Ej. Repasar Node.js, Express y MongoDB..."
                    className="w-full resize-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />

                </div>

              </div>

              <div className="md:col-span-2 border-t border-slate-200 pt-5 dark:border-slate-700">

                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Observaciones generales
                </label>

                <textarea
                  name="observaciones"
                  value={formulario.observaciones}
                  onChange={manejarCambio}
                  rows="4"
                  placeholder="Notas generales sobre la postulación..."
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />

              </div>

              <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={cerrarFormulario}
                  className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
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

function DatoMovil({
  icono,
  titulo,
  valor
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">

      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        {icono}

        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {titulo}
        </span>
      </div>

      <p className="mt-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
        {valor}
      </p>

    </div>
  );
}

function SeccionTitulo({
  etiqueta,
  titulo
}) {
  return (
    <div className="mt-2 border-t border-slate-200 pt-6 dark:border-slate-700 md:col-span-2">

      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {etiqueta}
      </p>

      <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
        {titulo}
      </h3>

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

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      />

    </div>
  );
}

function CampoIcono({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icono
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4 focus-within:border-blue-600 dark:border-slate-600 dark:bg-slate-700">

        <span className="shrink-0 text-slate-400">
          {icono}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-w-0 w-full border-0 bg-transparent px-3 py-3 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />

      </div>

    </div>
  );
}

function SelectCampo({
  label,
  name,
  value,
  onChange,
  opciones,
  opcionVacia
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-600 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
      >

        {opciones.map((opcion) => (

          <option
            key={opcion || "vacio"}
            value={opcion}
          >
            {opcion === "" && opcionVacia
              ? opcionVacia
              : opcion}
          </option>

        ))}

      </select>

    </div>
  );
}

export default Postulaciones;