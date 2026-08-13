import { useEffect, useState } from "react";
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
  Clock3
} from "lucide-react";

function Dashboard() {
  const [vista, setVista] = useState("dashboard");

  const [stats, setStats] = useState({
    total: 0,
    enviadas: 0,
    entrevistas: 0,
    pruebasTecnicas: 0,
    contratadas: 0,
    rechazadas: 0
  });

  const [proximasEntrevistas, setProximasEntrevistas] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const datosGrafico = [
    {
      nombre: "Enviadas",
      cantidad: stats.enviadas || 0
    },
    {
      nombre: "Entrevistas",
      cantidad: stats.entrevistas || 0
    },
    {
      nombre: "Pruebas",
      cantidad: stats.pruebasTecnicas || 0
    },
    {
      nombre: "Contratado",
      cantidad: stats.contratadas || 0
    },
    {
      nombre: "Rechazadas",
      cantidad: stats.rechazadas || 0
    }
  ];

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

    const cargarEntrevistas = async () => {
      try {
        const respuesta = await api.get(
          "/applications"
        );

        const ahora = new Date();

        const entrevistas = respuesta.data
          .filter((postulacion) => {
            if (!postulacion.fechaEntrevista) {
              return false;
            }

            return (
              new Date(postulacion.fechaEntrevista) >= ahora
            );
          })
          .sort(
            (a, b) =>
              new Date(a.fechaEntrevista) -
              new Date(b.fechaEntrevista)
          )
          .slice(0, 3);

        setProximasEntrevistas(entrevistas);

      } catch (error) {
        console.error(
          "Error al cargar entrevistas:",
          error
        );
      }
    };

    cargarEstadisticas();
    cargarEntrevistas();

  }, [vista]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 transition-colors dark:bg-slate-900 dark:text-white">

      <aside className="hidden w-64 flex-col bg-slate-950 text-white lg:flex">

        <div className="flex items-center gap-3 border-b border-slate-800 p-6">

          <div className="rounded-xl bg-blue-600 p-2.5">
            <BriefcaseBusiness size={24} />
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

        <nav className="flex-1 space-y-2 p-4">

          <MenuItem
            icono={<LayoutDashboard size={20} />}
            texto="Dashboard"
            activo={vista === "dashboard"}
            onClick={() => setVista("dashboard")}
          />

          <MenuItem
            icono={<FileText size={20} />}
            texto="Postulaciones"
            activo={vista === "postulaciones"}
            onClick={() => setVista("postulaciones")}
          />

          <MenuItem
            icono={<CalendarDays size={20} />}
            texto="Calendario"
            activo={vista === "calendario"}
            onClick={() => setVista("calendario")}
          />

          <MenuItem
            icono={<Building2 size={20} />}
            texto="Empresas"
            activo={vista === "empresas"}
            onClick={() => setVista("empresas")}
          />

          <MenuItem
            icono={<User size={20} />}
            texto="Perfil"
            activo={vista === "perfil"}
            onClick={() => setVista("perfil")}
          />

          <MenuItem
            icono={<Settings size={20} />}
            texto="Configuración"
            activo={vista === "configuracion"}
            onClick={() => setVista("configuracion")}
          />

        </nav>

        <div className="border-t border-slate-800 p-4">

          <button
            onClick={cerrarSesion}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-300 transition hover:bg-slate-800 hover:text-white"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>

        </div>

      </aside>

      <main className="flex-1">

        {vista === "postulaciones" ? (
          <Postulaciones />

        ) : vista === "calendario" ? (
          <Calendario />

        ) : vista === "empresas" ? (
          <Empresas />

        ) : vista === "perfil" ? (
          <Perfil />

        ) : vista === "configuracion" ? (
          <Configuracion />

        ) : (
          <div className="p-6 transition-colors dark:bg-slate-900 md:p-8">

            <div className="mx-auto max-w-7xl">

              <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>

                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Dashboard
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                    Hola, {usuario?.nombre || "Usuario"} 👋
                  </h2>

                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Aquí tienes el resumen de tu búsqueda laboral.
                  </p>

                </div>

                <button
                  onClick={() => setVista("postulaciones")}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  <Plus size={20} />
                  Nueva postulación
                </button>

              </header>

              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">

                <Card
                  titulo="Total"
                  valor={stats.total}
                  icono={<BriefcaseBusiness />}
                />

                <Card
                  titulo="Entrevistas"
                  valor={stats.entrevistas}
                  icono={<CalendarDays />}
                />

                <Card
                  titulo="Pruebas técnicas"
                  valor={stats.pruebasTecnicas}
                  icono={<FileCode2 />}
                />

                <Card
                  titulo="Contratado"
                  valor={stats.contratadas}
                  icono={<CheckCircle2 />}
                />

                <Card
                  titulo="Rechazadas"
                  valor={stats.rechazadas}
                  icono={<XCircle />}
                />

              </section>

              <section className="mt-8 grid gap-6 lg:grid-cols-3">

                <div className="rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-slate-800 lg:col-span-2">

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Actividad de postulaciones
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Distribución de tus procesos laborales por estado.
                  </p>

                  <div className="mt-6 h-72 w-full">

                    <ResponsiveContainer width="100%" height="100%">

                      <BarChart data={datosGrafico}>

                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="nombre"
                          tickLine={false}
                          axisLine={false}
                        />

                        <YAxis
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                        />

                        <Tooltip />

                        <Bar
                          dataKey="cantidad"
                          fill="#2563eb"
                          radius={[8, 8, 0, 0]}
                        />

                      </BarChart>

                    </ResponsiveContainer>

                  </div>

                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm transition-colors dark:bg-slate-800">

                  <div className="flex items-center justify-between gap-3">

                    <div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Próximas entrevistas
                      </h3>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Tus entrevistas programadas.
                      </p>

                    </div>

                    <button
                      onClick={() => setVista("calendario")}
                      className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Ver todas
                    </button>

                  </div>

                  <div className="mt-6 space-y-4">

                    {proximasEntrevistas.length > 0 ? (

                      proximasEntrevistas.map((entrevista) => {

                        const alerta = obtenerAlertaEntrevista(
                          entrevista.fechaEntrevista
                        );

                        return (
                          <div
                            key={entrevista._id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-700 dark:bg-slate-700"
                          >

                            <div className="flex items-start justify-between gap-3">

                              <div>

                                <p className="font-semibold text-slate-900 dark:text-white">
                                  {entrevista.empresa}
                                </p>

                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                  {entrevista.cargo}
                                </p>

                              </div>

                              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-slate-600 dark:text-blue-400">
                                <CalendarDays size={18} />
                              </div>

                            </div>

                            <div className="mt-3">

                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${alerta.clases}`}
                              >
                                {alerta.texto}
                              </span>

                            </div>

                            <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-600">

                              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">

                                {new Date(
                                  entrevista.fechaEntrevista
                                ).toLocaleDateString(
                                  "es-EC",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                  }
                                )}

                              </p>

                              <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">

                                <Clock3 size={15} />

                                {new Date(
                                  entrevista.fechaEntrevista
                                ).toLocaleTimeString(
                                  "es-EC",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  }
                                )}

                              </div>

                              {entrevista.plataformaEntrevista && (

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">

                                  <Video
                                    size={16}
                                    className="shrink-0 text-blue-600 dark:text-blue-400"
                                  />

                                  <span>
                                    {entrevista.plataformaEntrevista}
                                  </span>

                                </div>

                              )}

                              {entrevista.enlaceEntrevista &&
                                entrevista.plataformaEntrevista !==
                                  "Presencial" && (

                                <a
                                  href={entrevista.enlaceEntrevista}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                  <ExternalLink size={16} />
                                  Abrir reunión
                                </a>

                              )}

                            </div>

                          </div>
                        );
                      })

                    ) : (

                      <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-400 transition-colors dark:bg-slate-700 dark:text-slate-400">
                        Sin entrevistas próximas
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

function obtenerAlertaEntrevista(fechaEntrevista) {
  const ahora = new Date();
  const entrevista = new Date(fechaEntrevista);

  const hoy = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );

  const diaEntrevista = new Date(
    entrevista.getFullYear(),
    entrevista.getMonth(),
    entrevista.getDate()
  );

  const diferenciaMs =
    diaEntrevista.getTime() - hoy.getTime();

  const diferenciaDias = Math.round(
    diferenciaMs / (1000 * 60 * 60 * 24)
  );

  if (diferenciaDias === 0) {
    return {
      texto: "HOY",
      clases:
        "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
    };
  }

  if (diferenciaDias === 1) {
    return {
      texto: "MAÑANA",
      clases:
        "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
    };
  }

  return {
    texto: `EN ${diferenciaDias} DÍAS`,
    clases:
      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
  };
}

function Card({
  titulo,
  valor,
  icono
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-800">

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
          {icono}
        </div>

      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {valor}
      </p>

    </div>
  );
}

function MenuItem({
  icono,
  texto,
  activo = false,
  onClick
}) {
  return (
    <button
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