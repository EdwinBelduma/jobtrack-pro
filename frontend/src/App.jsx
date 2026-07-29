import { BriefcaseBusiness, LockKeyhole, Mail } from "lucide-react";

function App() {
  return (
    <main className="min-h-screen bg-slate-100 lg:grid lg:grid-cols-2">
      <section className="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <BriefcaseBusiness size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">JobTrack Pro</h1>
            <p className="text-sm text-slate-400">
              Control inteligente de postulaciones
            </p>
          </div>
        </div>

        <div>
          <h2 className="max-w-xl text-5xl font-bold leading-tight">
            Convierte tu búsqueda de empleo en un proceso organizado.
          </h2>

          <p className="mt-6 max-w-lg text-lg text-slate-300">
            Gestiona empresas, entrevistas, pruebas técnicas, contactos y
            estadísticas desde un solo lugar.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          Desarrollado con React, Node.js, Express y MongoDB.
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-600 p-3 text-white">
                <BriefcaseBusiness size={24} />
              </div>

              <h1 className="text-2xl font-bold">JobTrack Pro</h1>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Iniciar sesión
          </h2>

          <p className="mt-2 text-slate-500">
            Ingresa tus datos para acceder al panel.
          </p>

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Correo electrónico
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
                <Mail size={19} className="text-slate-400" />

                <input
                  type="email"
                  placeholder="edwin@test.com"
                  className="w-full border-0 bg-transparent px-3 py-3.5 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Contraseña
              </label>

              <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600">
                <LockKeyhole size={19} className="text-slate-400" />

                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full border-0 bg-transparent px-3 py-3.5 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Ingresar
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            ¿Todavía no tienes una cuenta?{" "}
            <button className="font-semibold text-blue-600">
              Crear cuenta
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}

export default App;