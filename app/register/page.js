import { register } from "@/lib/actions/auth";

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-1">TINKUY</h1>
        <p className="text-center text-gray-500 mb-6">
          Crea tu tarjeta digital
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <form action={register} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="username"
            >
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="juanperez"
              pattern="[A-Za-z0-9_-]{3,30}"
              title="3-30 caracteres: letras, numeros, - o _"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <p className="text-xs text-gray-400 mt-1">
              Se guardara en minusculas. Sera tu link publico: tinkuy.app/u/tu-usuario
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white rounded-lg py-2 font-medium hover:bg-gray-800 transition"
          >
            Crear cuenta
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-black font-medium underline">
            Ingresa
          </a>
        </p>
      </div>
    </main>
  );
}
