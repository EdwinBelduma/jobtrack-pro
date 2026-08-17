import {
  useEffect,
  useMemo,
  useState
} from "react";

import api from "../api/axios";

import Postulaciones from "./Postulaciones";
import Calendario from "./Calendario";
import Empresas from "./Empresas";
import Perfil from "./Perfil";
import Configuracion from "./Configuracion";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import {
  BriefcaseBusiness,
  LayoutDashboard,
  FileText,
  CalendarDays,
  Building2,
  User,
  Settings,
  LogOut,
  FileCode2,
  CheckCircle2,
  XCircle,
  Plus,
  Video,
  ExternalLink,
  Clock3,
  Menu,
  X,
  Bell,
  BellOff,
  ArrowRight,
  Activity,
  Target,
  TrendingUp,
  RefreshCw
} from "lucide-react";

function Dashboard() {
  const [vista, setVista] =
    useState("dashboard");

  const [
    menuMovilAbierto,
    setMenuMovilAbierto
  ] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    enviadas: 0,
    entrevistas: 0,
    pruebasTecnicas: 0,
    contratadas: 0,
    rechazadas: 0
  });

  const [
    proximasEntrevistas,
    setProximasEntrevistas
  ] = useState([]);

  const [
    notificacionesActivas,
    setNotificacionesActivas
  ] = useState(true);

  const [
    notificacionesNavegador,
    setNotificacionesNavegador
  ] = useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [errorDatos, setErrorDatos] =
    useState("");

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  /*
   * ===========================
   * MÉTRICAS
   * ===========================
   */

  const procesosActivos = Math.max(
    0,
    (stats.total || 0) -
      (stats.contratadas || 0) -
      (stats.rechazadas || 0)
  );

  const tasaEntrevistas =
    stats.total > 0
      ? Math.round(
          (stats.entrevistas /
            stats.total) *
            100
        )
      : 0;

  const tasaContratacion =
    stats.total > 0
      ? Math.round(
          (stats.contratadas /
            stats.total) *
            100
        )
      : 0;

  /*
   * ===========================
   * GRÁFICO
   * ===========================
   */

  const datosGrafico = useMemo(
    () => [
      {
        nombre: "Enviadas",
        cantidad:
          stats.enviadas || 0
      },
      {
        nombre: "Entrevistas",
        cantidad:
          stats.entrevistas || 0
      },
      {
        nombre: "Pruebas",
        cantidad:
          stats.pruebasTecnicas || 0
      },
      {
        nombre: "Contratado",
        cantidad:
          stats.contratadas || 0
      },
      {
        nombre: "Rechazadas",
        cantidad:
          stats.rechazadas || 0
      }
    ],
    [stats]
  );

  /*
   * ===========================
   * CONFIGURACIÓN
   * ===========================
   */

  useEffect(() => {
    try {
      const configuracionGuardada =
        JSON.parse(
          localStorage.getItem(
            "configuracion"
          )
        );

      setNotificacionesActivas(
        configuracionGuardada
          ?.notificaciones ?? true
      );

      setNotificacionesNavegador(
        configuracionGuardada
          ?.notificacionesNavegador ??
          false
      );

    } catch (error) {
      console.error(
        "Error al leer configuración:",
        error
      );

      setNotificacionesActivas(true);
      setNotificacionesNavegador(false);
    }
  }, [vista]);

  /*
   * ===========================
   * CARGAR DASHBOARD
   * ===========================
   */

  const cargarDashboard = async () => {
    setCargando(true);
    setErrorDatos("");

    try {
      const [
        respuestaStats,
        respuestaPostulaciones
      ] = await Promise.all([
        api.get(
          "/applications/stats"
        ),

        api.get(
          "/applications"
        )
      ]);

      setStats(
        respuestaStats.data
      );

      const ahora = new Date();

      const entrevistas =
        respuestaPostulaciones.data
          .filter(
            (postulacion) => {
              if (
                !postulacion.fechaEntrevista
              ) {
                return false;
              }

              const fecha =
                new Date(
                  postulacion.fechaEntrevista
                );

              return fecha >= ahora;
            }
          )
          .sort(
            (a, b) =>
              new Date(
                a.fechaEntrevista
              ) -
              new Date(
                b.fechaEntrevista
              )
          );

      setProximasEntrevistas(
        entrevistas
      );

    } catch (error) {
      console.error(
        "Error al cargar dashboard:",
        error
      );

      setErrorDatos(
        "No se pudieron actualizar los datos del Dashboard."
      );

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, [vista]);

  /*
   * ===========================
   * RECORDATORIOS
   * ===========================
   */

  const recordatoriosEntrevistas =
    useMemo(
      () =>
        proximasEntrevistas.filter(
          (entrevista) => {
            const dias =
              obtenerDiferenciaDias(
                entrevista.fechaEntrevista
              );

            return (
              dias === 0 ||
              dias === 1
            );
          }
        ),
      [proximasEntrevistas]
    );

  /*
   * ===========================
   * NOTIFICACIONES NAVEGADOR
   * ===========================
   */

  useEffect(() => {
    if (
      !notificacionesActivas ||
      !notificacionesNavegador
    ) {
      return;
    }

    if (
      !(
        "Notification" in window
      )
    ) {
      return;
    }

    if (
      Notification.permission !==
      "granted"
    ) {
      return;
    }

    recordatoriosEntrevistas.forEach(
      (entrevista) => {
        const alerta =
          obtenerAlertaEntrevista(
            entrevista.fechaEntrevista
          );

        /*
         * Incluimos HOY / MAÑANA
         * en la clave.
         *
         * Así puede avisar una vez
         * cuando falta un día y
         * nuevamente el día de la
         * entrevista.
         */
        const clave =
          `jobtrack-notificacion-${entrevista._id}-${alerta.texto}`;

        const yaNotificada =
          localStorage.getItem(
            clave
          );

        if (yaNotificada) {
          return;
        }

        const fecha =
          new Date(
            entrevista.fechaEntrevista
          );

        const hora =
          fecha.toLocaleTimeString(
            "es-EC",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          );

        const plataforma =
          entrevista.plataformaEntrevista
            ? ` · ${entrevista.plataformaEntrevista}`
            : "";

        const notificacion =
          new Notification(
            "JobTrack Pro",
            {
              body:
                `${alerta.texto}: entrevista con ${entrevista.empresa} para ${entrevista.cargo} a las ${hora}${plataforma}`,

              tag: clave
            }
          );

        notificacion.onclick =
          () => {
            window.focus();
          };

        localStorage.setItem(
          clave,
          "true"
        );
      }
    );

  }, [
    recordatoriosEntrevistas,
    notificacionesActivas,
    notificacionesNavegador
  ]);

  /*
   * ===========================
   * NAVEGACIÓN
   * ===========================
   */

  const cambiarVista = (
    nuevaVista
  ) => {
    setVista(nuevaVista);
    setMenuMovilAbierto(false);
  };

  const cerrarSesion = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "usuario"
    );

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white">

      {/* ================= */}
      {/* SIDEBAR */}
      {/* ================= */}

      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 text-white lg:flex">

        <Logo />

        <Navegacion
          vista={vista}
          cambiarVista={
            cambiarVista
          }
        />

        <div className="border-t border-slate-800 p-4">

          <button
            type="button"
            onClick={cerrarSesion}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>

        </div>

      </aside>

      {/* ================= */}
      {/* HEADER MÓVIL */}
      {/* ================= */}

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:hidden">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <BriefcaseBusiness
              size={21}
            />
          </div>

          <div>

            <h1 className="font-bold text-slate-900 dark:text-white">
              JobTrack Pro
            </h1>

            <p className="text-xs text-slate-400">
              Career Manager
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            setMenuMovilAbierto(true)
          }
          className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Abrir menú"
        >
          <Menu size={24} />
        </button>

      </header>

      {/* ================= */}
      {/* MENÚ MÓVIL */}
      {/* ================= */}

      {menuMovilAbierto && (

        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() =>
            setMenuMovilAbierto(false)
          }
        >

          <aside
            onClick={(e) =>
              e.stopPropagation()
            }
            className="flex h-full w-[85%] max-w-xs flex-col bg-slate-950 text-white shadow-2xl"
          >

            <div className="flex items-center justify-between border-b border-slate-800">

              <Logo />

              <button
                type="button"
                onClick={() =>
                  setMenuMovilAbierto(
                    false
                  )
                }
                className="mr-4 rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <X size={22} />
              </button>

            </div>

            <Navegacion
              vista={vista}
              cambiarVista={
                cambiarVista
              }
            />

            <div className="border-t border-slate-800 p-4">

              <button
                type="button"
                onClick={
                  cerrarSesion
                }
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <LogOut
                  size={20}
                />

                Cerrar sesión
              </button>

            </div>

          </aside>

        </div>

      )}

      {/* ================= */}
      {/* CONTENIDO */}
      {/* ================= */}

      <main className="min-h-screen lg:ml-64">

        {vista ===
        "postulaciones" ? (

          <Postulaciones />

        ) : vista ===
          "calendario" ? (

          <Calendario />

        ) : vista ===
          "empresas" ? (

          <Empresas />

        ) : vista ===
          "perfil" ? (

          <Perfil />

        ) : vista ===
          "configuracion" ? (

          <Configuracion />

        ) : (

          <div className="p-4 dark:bg-slate-900 sm:p-6 md:p-8">

            <div className="mx-auto max-w-7xl">

              {/* ================= */}
              {/* CABECERA */}
              {/* ================= */}

              <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>

                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Dashboard
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    Hola,{" "}
                    {usuario?.nombre ||
                      "Usuario"}{" "}
                    👋
                  </h2>

                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Aquí tienes el resumen de tu búsqueda laboral.
                  </p>

                </div>

                <div className="flex w-full gap-3 md:w-auto">

                  <button
                    type="button"
                    onClick={
                      cargarDashboard
                    }
                    disabled={cargando}
                    className="flex items-center justify-center rounded-xl border border-slate-300 bg-white p-3 text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    title="Actualizar Dashboard"
                  >
                    <RefreshCw
                      size={20}
                      className={
                        cargando
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      cambiarVista(
                        "postulaciones"
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 md:flex-none"
                  >
                    <Plus size={20} />
                    Nueva postulación
                  </button>

                </div>

              </header>

              {/* ERROR */}
              {errorDatos && (

                <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                  {errorDatos}
                </div>

              )}

              {/* ================= */}
              {/* RECORDATORIOS */}
              {/* ================= */}

              {notificacionesActivas &&
                recordatoriosEntrevistas.length >
                  0 && (

                <section className="mb-8">

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm dark:border-blue-900 dark:bg-blue-950/30 sm:p-5">

                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

                      <div className="flex items-start gap-3">

                        <div className="shrink-0 rounded-xl bg-blue-600 p-2.5 text-white">

                          <Bell
                            size={21}
                          />

                        </div>

                        <div>

                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Recordatorios de entrevistas
                          </h3>

                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">

                            {recordatoriosEntrevistas.length ===
                            1
                              ? "Tienes una entrevista muy próxima."
                              : `Tienes ${recordatoriosEntrevistas.length} entrevistas muy próximas.`}

                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarVista(
                            "calendario"
                          )
                        }
                        className="flex items-center gap-2 text-sm font-semibold text-blue-700 transition hover:text-blue-800 dark:text-blue-300"
                      >
                        Ver calendario

                        <ArrowRight
                          size={16}
                        />
                      </button>

                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">

                      {recordatoriosEntrevistas.map(
                        (
                          entrevista
                        ) => {

                          const alerta =
                            obtenerAlertaEntrevista(
                              entrevista.fechaEntrevista
                            );

                          return (

                            <div
                              key={
                                entrevista._id
                              }
                              className="rounded-xl bg-white p-4 shadow-sm dark:bg-slate-800"
                            >

                              <div className="flex items-start justify-between gap-3">

                                <div className="min-w-0">

                                  <p className="truncate font-bold text-slate-900 dark:text-white">
                                    {
                                      entrevista.empresa
                                    }
                                  </p>

                                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {
                                      entrevista.cargo
                                    }
                                  </p>

                                </div>

                                <span
                                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${alerta.clases}`}
                                >
                                  {
                                    alerta.texto
                                  }
                                </span>

                              </div>

                              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">

                                <div className="flex items-center gap-2">

                                  <CalendarDays
                                    size={
                                      16
                                    }
                                  />

                                  {new Date(
                                    entrevista.fechaEntrevista
                                  ).toLocaleDateString(
                                    "es-EC",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric"
                                    }
                                  )}

                                </div>

                                <div className="flex items-center gap-2">

                                  <Clock3
                                    size={
                                      16
                                    }
                                  />

                                  {new Date(
                                    entrevista.fechaEntrevista
                                  ).toLocaleTimeString(
                                    "es-EC",
                                    {
                                      hour:
                                        "2-digit",
                                      minute:
                                        "2-digit"
                                    }
                                  )}

                                </div>

                              </div>

                              {entrevista.plataformaEntrevista && (

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">

                                  <Video
                                    size={
                                      16
                                    }
                                    className="text-blue-600 dark:text-blue-400"
                                  />

                                  {
                                    entrevista.plataformaEntrevista
                                  }

                                </div>

                              )}

                              {entrevista.enlaceEntrevista &&
                                entrevista.plataformaEntrevista !==
                                  "Presencial" && (

                                <a
                                  href={
                                    entrevista.enlaceEntrevista
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                  <ExternalLink
                                    size={
                                      16
                                    }
                                  />

                                  Abrir reunión
                                </a>

                              )}

                            </div>

                          );
                        }
                      )}

                    </div>

                  </div>

                </section>

              )}

              {!notificacionesActivas && (

                <section className="mb-8">

                  <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:flex-row sm:items-center">

                    <div className="flex items-center gap-3">

                      <div className="rounded-xl bg-slate-100 p-2.5 text-slate-500 dark:bg-slate-700">

                        <BellOff
                          size={21}
                        />

                      </div>

                      <div>

                        <p className="font-semibold">
                          Recordatorios desactivados
                        </p>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          No se mostrarán alertas de entrevistas próximas.
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarVista(
                          "configuracion"
                        )
                      }
                      className="text-left text-sm font-semibold text-blue-600 dark:text-blue-400"
                    >
                      Ir a configuración
                    </button>

                  </div>

                </section>

              )}

              {/* ================= */}
              {/* ESTADÍSTICAS */}
              {/* ================= */}

              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

                <Card
                  titulo="Total"
                  valor={stats.total}
                  descripcion="Procesos registrados"
                  icono={
                    <BriefcaseBusiness />
                  }
                />

                <Card
                  titulo="Activos"
                  valor={procesosActivos}
                  descripcion="Procesos en curso"
                  icono={
                    <Activity />
                  }
                />

                <Card
                  titulo="Entrevistas"
                  valor={
                    stats.entrevistas
                  }
                  descripcion="Procesos en entrevista"
                  icono={
                    <CalendarDays />
                  }
                />

                <Card
                  titulo="Pruebas"
                  valor={
                    stats.pruebasTecnicas
                  }
                  descripcion="Pruebas técnicas"
                  icono={
                    <FileCode2 />
                  }
                />

                <Card
                  titulo="Contratado"
                  valor={
                    stats.contratadas
                  }
                  descripcion="Procesos exitosos"
                  icono={
                    <CheckCircle2 />
                  }
                />

                <Card
                  titulo="Rechazadas"
                  valor={
                    stats.rechazadas
                  }
                  descripcion="Procesos cerrados"
                  icono={
                    <XCircle />
                  }
                />

              </section>

              {/* ================= */}
              {/* INDICADORES */}
              {/* ================= */}

              <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <Indicador
                  icono={
                    <TrendingUp />
                  }
                  titulo="Tasa de entrevistas"
                  valor={`${tasaEntrevistas}%`}
                  descripcion="Porcentaje de tus postulaciones que llegaron a entrevista."
                />

                <Indicador
                  icono={
                    <Target />
                  }
                  titulo="Tasa de contratación"
                  valor={`${tasaContratacion}%`}
                  descripcion="Porcentaje de procesos registrados que terminaron en contratación."
                />

                <Indicador
                  icono={
                    <Activity />
                  }
                  titulo="Procesos activos"
                  valor={procesosActivos}
                  descripcion="Postulaciones que todavía siguen abiertas."
                />

              </section>

              {/* ================= */}
              {/* GRÁFICO + AGENDA */}
              {/* ================= */}

              <section className="mt-8 grid gap-6 lg:grid-cols-3">

                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-6 lg:col-span-2">

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="text-lg font-bold">
                        Actividad de postulaciones
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Distribución de tus procesos laborales por estado.
                      </p>

                    </div>

                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-slate-700 dark:text-blue-400">

                      <TrendingUp
                        size={20}
                      />

                    </div>

                  </div>

                  <div className="mt-6 h-64 w-full sm:h-72">

                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >

                      <BarChart
                        data={datosGrafico}
                        margin={{
                          top: 5,
                          right: 5,
                          left: -15,
                          bottom: 0
                        }}
                      >

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="nombre"
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                        />

                        <YAxis
                          allowDecimals={
                            false
                          }
                          tickLine={false}
                          axisLine={false}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="cantidad"
                          fill="#2563eb"
                          radius={[
                            8,
                            8,
                            0,
                            0
                          ]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

                {/* PRÓXIMAS ENTREVISTAS */}
                <div className="rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-800 sm:p-6">

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h3 className="text-lg font-bold">
                        Próximas entrevistas
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Tus entrevistas programadas.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        cambiarVista(
                          "calendario"
                        )
                      }
                      className="shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400"
                    >
                      Ver todas
                    </button>

                  </div>

                  <div className="mt-6 space-y-4">

                    {proximasEntrevistas.length >
                    0 ? (

                      proximasEntrevistas
                        .slice(0, 3)
                        .map(
                          (
                            entrevista
                          ) => {

                            const alerta =
                              obtenerAlertaEntrevista(
                                entrevista.fechaEntrevista
                              );

                            return (

                              <div
                                key={
                                  entrevista._id
                                }
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 dark:border-slate-700 dark:bg-slate-700"
                              >

                                <div className="flex justify-between gap-3">

                                  <div className="min-w-0">

                                    <p className="truncate font-semibold">
                                      {
                                        entrevista.empresa
                                      }
                                    </p>

                                    <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                      {
                                        entrevista.cargo
                                      }
                                    </p>

                                  </div>

                                  <div className="shrink-0 rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-slate-600 dark:text-blue-400">

                                    <CalendarDays
                                      size={
                                        18
                                      }
                                    />

                                  </div>

                                </div>

                                <span
                                  className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${alerta.clases}`}
                                >
                                  {
                                    alerta.texto
                                  }
                                </span>

                                <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-600">

                                  <p className="text-sm font-medium">

                                    {new Date(
                                      entrevista.fechaEntrevista
                                    ).toLocaleDateString(
                                      "es-EC",
                                      {
                                        weekday:
                                          "short",
                                        day:
                                          "2-digit",
                                        month:
                                          "short",
                                        year:
                                          "numeric"
                                      }
                                    )}

                                  </p>

                                  <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                                    <Clock3
                                      size={
                                        15
                                      }
                                    />

                                    {new Date(
                                      entrevista.fechaEntrevista
                                    ).toLocaleTimeString(
                                      "es-EC",
                                      {
                                        hour:
                                          "2-digit",
                                        minute:
                                          "2-digit"
                                      }
                                    )}

                                  </div>

                                  {entrevista.plataformaEntrevista && (

                                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                                      <Video
                                        size={
                                          15
                                        }
                                      />

                                      {
                                        entrevista.plataformaEntrevista
                                      }

                                    </div>

                                  )}

                                  {entrevista.enlaceEntrevista &&
                                    entrevista.plataformaEntrevista !==
                                      "Presencial" && (

                                    <a
                                      href={
                                        entrevista.enlaceEntrevista
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                      <ExternalLink
                                        size={
                                          15
                                        }
                                      />

                                      Abrir reunión
                                    </a>

                                  )}

                                </div>

                              </div>

                            );
                          }
                        )

                    ) : (

                      <div className="rounded-xl bg-slate-50 p-6 text-center dark:bg-slate-700">

                        <CalendarDays
                          size={32}
                          className="mx-auto text-slate-300 dark:text-slate-500"
                        />

                        <p className="mt-3 text-sm text-slate-400">
                          Sin entrevistas próximas
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </section>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

/*
 * ===========================
 * LOGO
 * ===========================
 */

function Logo() {
  return (
    <div className="flex items-center gap-3 p-6">

      <div className="rounded-xl bg-blue-600 p-2.5">
        <BriefcaseBusiness
          size={24}
        />
      </div>

      <div>

        <h1 className="font-bold">
          JobTrack Pro
        </h1>

        <p className="text-xs text-slate-400">
          Career Manager
        </p>

      </div>

    </div>
  );
}

/*
 * ===========================
 * NAVEGACIÓN
 * ===========================
 */

function Navegacion({
  vista,
  cambiarVista
}) {
  return (
    <nav className="flex-1 space-y-2 overflow-y-auto p-4">

      <MenuItem
        icono={
          <LayoutDashboard
            size={20}
          />
        }
        texto="Dashboard"
        activo={
          vista === "dashboard"
        }
        onClick={() =>
          cambiarVista("dashboard")
        }
      />

      <MenuItem
        icono={
          <FileText size={20} />
        }
        texto="Postulaciones"
        activo={
          vista ===
          "postulaciones"
        }
        onClick={() =>
          cambiarVista(
            "postulaciones"
          )
        }
      />

      <MenuItem
        icono={
          <CalendarDays
            size={20}
          />
        }
        texto="Calendario"
        activo={
          vista === "calendario"
        }
        onClick={() =>
          cambiarVista("calendario")
        }
      />

      <MenuItem
        icono={
          <Building2 size={20} />
        }
        texto="Empresas"
        activo={
          vista === "empresas"
        }
        onClick={() =>
          cambiarVista("empresas")
        }
      />

      <MenuItem
        icono={
          <User size={20} />
        }
        texto="Perfil"
        activo={
          vista === "perfil"
        }
        onClick={() =>
          cambiarVista("perfil")
        }
      />

      <MenuItem
        icono={
          <Settings size={20} />
        }
        texto="Configuración"
        activo={
          vista ===
          "configuracion"
        }
        onClick={() =>
          cambiarVista(
            "configuracion"
          )
        }
      />

    </nav>
  );
}

/*
 * ===========================
 * FECHAS
 * ===========================
 */

function obtenerDiferenciaDias(
  fechaEntrevista
) {
  const ahora = new Date();

  const entrevista =
    new Date(
      fechaEntrevista
    );

  const hoy = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );

  const diaEntrevista =
    new Date(
      entrevista.getFullYear(),
      entrevista.getMonth(),
      entrevista.getDate()
    );

  return Math.round(
    (
      diaEntrevista.getTime() -
      hoy.getTime()
    ) /
      (1000 * 60 * 60 * 24)
  );
}

function obtenerAlertaEntrevista(
  fechaEntrevista
) {
  const dias =
    obtenerDiferenciaDias(
      fechaEntrevista
    );

  if (dias === 0) {
    return {
      texto: "HOY",
      clases:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    };
  }

  if (dias === 1) {
    return {
      texto: "MAÑANA",
      clases:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
    };
  }

  return {
    texto:
      dias > 1
        ? `EN ${dias} DÍAS`
        : "PRÓXIMA",

    clases:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
  };
}

/*
 * ===========================
 * CARD
 * ===========================
 */

function Card({
  titulo,
  valor,
  descripcion,
  icono
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800">

      <div className="mb-4">

        <div className="w-fit rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
          {icono}
        </div>

      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {valor || 0}
      </p>

      <p className="mt-2 text-xs text-slate-400">
        {descripcion}
      </p>

    </div>
  );
}

/*
 * ===========================
 * INDICADOR
 * ===========================
 */

function Indicador({
  icono,
  titulo,
  valor,
  descripcion
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {titulo}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
            {valor}
          </p>

        </div>

        <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
          {icono}
        </div>

      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-400">
        {descripcion}
      </p>

    </div>
  );
}

/*
 * ===========================
 * MENU ITEM
 * ===========================
 */

function MenuItem({
  icono,
  texto,
  activo = false,
  onClick
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
        activo
          ? "bg-blue-600 text-white"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      {icono}
      {texto}
    </button>
  );
}

export default Dashboard;