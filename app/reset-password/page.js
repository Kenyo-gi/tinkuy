import Logo from "@/components/Logo";
import { updatePassword } from "@/lib/actions/auth";

export default async function ResetPasswordPage({ searchParams }) {
  const sp = await searchParams;

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-8">
        <div className="flex justify-center mb-4"><Logo /></div>
        <p className="text-center text-zinc-500 mb-6">Crea tu nueva contrasena</p>

        {sp?.error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{sp.error}</p>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">Nueva contrasena</label>
            <input id="password" name="password" type="password" required minLength={6} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirm_password">Repite la contrasena</label>
            <input id="confirm_password" name="confirm_password" type="password" required minLength={6} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition">Guardar nueva contrasena</button>
        </form>
      </div>
    </main>
  );
}
