import { useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  LockKeyhole,
  UserPlus,
  ArrowLeft,
  LoaderCircle,
  Eye,
  EyeOff
} from "lucide-react";

function Registro({ volverLogin }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

  const registrarUsuario = async (e) => {
    e.preventDefault();

    setMensaje("");

    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setCargando(true);

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          nombre,
          email,
          password
        }
      );

      setMensaje("Cuenta creada correctamente");

      setTimeout(() => {
        volverLogin();
      }, 1500);

    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje ||
        "No se pudo crear la cuenta"
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 transition-colors dark:bg-slate-900">

      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center">

        <div className="w-full rounded-3xl bg-white p-8 shadow-xl dark:bg-slate-800">

          <button
            onClick={volverLogin}
            className="mb-6 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400"
          >
            <ArrowLeft size={18} />
            Volver al login
          </button>

          <div className="mb-8">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400">
              <UserPlus size={27} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Crear cuenta
            </h1>

            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Regístrate para comenzar a organizar tu búsqueda laboral.
            </p>

          </div>

          <form
            onSubmit={registrarUsuario}
            className="space-y-5"
          >

            <Campo
              label="Nombre"
              icono={<User size={19} />}
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

            <Campo
              label="Correo electrónico"
              icono={<Mail size={19} />}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
            />

            <CampoPassword
              label="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              mostrar={mostrarPassword}
              cambiarVisibilidad={() =>
                setMostrarPassword(!mostrarPassword)
              }
            />

            <CampoPassword
              label="Confirmar contraseña"
              value={confirmarPassword}
              onChange={(e) =>
                setConfirmarPassword(e.target.value)
              }
              placeholder="Repite tu contraseña"
              mostrar={mostrarConfirmarPassword}
              cambiarVisibilidad={() =>
                setMostrarConfirmarPassword(
                  !mostrarConfirmarPassword
                )
              }
            />

            {mensaje && (
              <div
                className={`rounded-xl p-3 text-sm ${
                  mensaje === "Cuenta creada correctamente"
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {cargando ? (
                <>
                  <LoaderCircle
                    size={20}
                    className="animate-spin"
                  />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Crear cuenta
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}

function Campo({
  label,
  icono,
  type,
  value,
  onChange,
  placeholder
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600 dark:border-slate-600">

        <span className="text-slate-400">
          {icono}
        </span>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full border-0 bg-transparent px-3 py-3.5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />

      </div>

    </div>
  );
}

function CampoPassword({
  label,
  value,
  onChange,
  placeholder,
  mostrar,
  cambiarVisibilidad
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-300 px-4 focus-within:border-blue-600 dark:border-slate-600">

        <LockKeyhole
          size={19}
          className="text-slate-400"
        />

        <input
          type={mostrar ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className="w-full border-0 bg-transparent px-3 py-3.5 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />

        <button
          type="button"
          onClick={cambiarVisibilidad}
          className="text-slate-400 transition hover:text-blue-600 dark:hover:text-blue-400"
          title={
            mostrar
              ? "Ocultar contraseña"
              : "Mostrar contraseña"
          }
        >
          {mostrar ? (
            <EyeOff size={19} />
          ) : (
            <Eye size={19} />
          )}
        </button>

      </div>

    </div>
  );
}

export default Registro;