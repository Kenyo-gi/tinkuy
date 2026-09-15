import Link from "next/link";
import Logo from "@/components/Logo";
import { login } from "@/lib/actions/auth";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;
  const success = params?.success;

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <div className="flex justify-center mb-4"><Logo /></div>
        <p className="text-center text-zinc-500 mb-6">Ingresa a tu tarjeta digital</p>

        {success && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{success}</p>
        )}
        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Contrasena</label>
            <input id="password" name="password" type="password" required className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition">Ingresar</button>
        </form>

        <p className="text-center text-sm text-zinc-500 mt-4">
          <Link href="/forgot-password" className="text-blue-600 font-medium hover:underline">Olvidaste tu contrasena?</Link>
        </p>

        <p className="text-center text-sm text-zinc-500 mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-zinc-900 font-medium underline">Registrate</Link>
        </p>
      </div>
    </main>
  );
}
