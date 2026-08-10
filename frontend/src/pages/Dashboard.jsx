import { useEffect, useState } from "react";
import axios from "axios";
import Postulaciones from "./Postulaciones";

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
  Plus
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

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const respuesta = await axios.get(
          "http://localhost:5000/api/applications/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setStats(respuesta.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };

    cargarEstadisticas();
  }, [token]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    window.location.reload();
  };

  return (
    <div className="flex min-h-screen bg-slate-100">

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
          />

          <MenuItem
            icono={<Building2 size={20} />}
            texto="Empresas"
          />

          <MenuItem
            icono={<User size={20} />}
            texto="Perfil"
          />

          <MenuItem
            icono={<Settings size={20} />}
            texto="Configuración"
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
        ) : (
          <div className="p-6 md:p-8">

            <div className="mx-auto max-w-7xl">

              <header className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-center">

                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Dashboard
                  </p>

                  <h2 className="mt-1 text-3xl font-bold text-slate-900">
                    Hola, {usuario?.nombre || "Usuario"} 👋
                  </h2>

                  <p className="mt-2 text-slate-500">
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

                <div className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">

                  <h3 className="text-lg font-bold text-slate-900">
                    Actividad de postulaciones
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Aquí mostraremos el gráfico de tu progreso.
                  </p>

                  <div className="mt-6 flex h-64 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    Próximamente: gráfico de postulaciones
                  </div>

                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">

                  <h3 className="text-lg font-bold text-slate-900">
                    Próximas entrevistas
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Tus entrevistas programadas aparecerán aquí.
                  </p>

                  <div className="mt-6 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-400">
                    Sin entrevistas próximas
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

function Card({ titulo, valor, icono }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      <div className="mb-5 flex items-center justify-between">

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          {icono}
        </div>

      </div>

      <p className="text-sm font-medium text-slate-500">
        {titulo}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
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