import Link from "next/link";
import Logo from "@/components/Logo";
import { submitTestimonial } from "@/lib/actions/testimonials";

export default async function OpinionPage({ searchParams }) {
  const sp = await searchParams;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <Link href="/"><Logo size="sm" /></Link>
        </div>
        <h1 className="text-xl font-bold text-zinc-900 mb-2">Danos tu opinion</h1>
        <p className="text-sm text-zinc-500 mb-6">Cuentanos que te parecio TINKUY. Tu comentario se publicara en la pagina principal luego de ser revisado.</p>

        {sp?.success && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Gracias por tu comentario. Lo revisaremos antes de publicarlo.</p>
        )}
        {sp?.error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{sp.error}</p>
        )}

        <form action={submitTestimonial} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
            <input type="text" name="name" required maxLength={60} placeholder="Maria Perez" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tu comentario</label>
            <textarea name="quote" required maxLength={300} rows={4} placeholder="Que te parecio la tarjeta digital?" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-blue-700 transition">Enviar comentario</button>
        </form>
      </div>
    </main>
  );
}
