import Link from "next/link";
import Logo from "@/components/Logo";

const FEATURES = [
  { title: "Un solo link para todo", text: "Tus datos, telefono, WhatsApp, CV y redes sociales en una sola tarjeta digital." },
  { title: "Comparte con QR (y pronto NFC)", text: "Que te escaneen y accedan a tu tarjeta al instante, sin escribir nada." },
  { title: "Guardan tu contacto", text: "Con un boton descargan tu vCard directo a los contactos de su celular." },
  { title: "Sabes quien te visito", text: "Cuenta cuantas veces vieron tu tarjeta y si fue por QR o por link." },
];

const STEPS = [
  { n: "1", title: "Creas tu cuenta", text: "Te registras gratis y eliges tu nombre de usuario." },
  { n: "2", title: "Llenas tu tarjeta", text: "Foto, datos, CV y redes sociales, todo en tu panel." },
  { n: "3", title: "La compartes", text: "Con tu link o tu QR descargable, donde quieras." },
];

const TESTIMONIALS = [
  { quote: "Aqui puedes agregar el comentario real de uno de tus primeros usuarios.", name: "Espacio disponible" },
  { quote: "Aqui puedes agregar el comentario real de otro usuario que probo tu tarjeta.", name: "Espacio disponible" },
];

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition">Ingresar</Link>
            <Link href="/register" className="bg-blue-600 text-white text-sm rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition">Crear mi tarjeta</Link>
          </nav>
        </div>
      </header>

      <section className="bg-zinc-50 px-4 py-16 text-center">
        <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-3 py-1 mb-4">Version Beta</span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 max-w-2xl mx-auto text-zinc-900">Tu tarjeta de presentacion digital, en un solo link</h1>
        <p className="text-zinc-500 max-w-md mx-auto mb-8">
          Comparte tus datos, tu WhatsApp, tu CV y tus redes sociales con un QR. Nada de tarjetas de papel que se pierden.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/register" className="bg-blue-600 text-white rounded-lg px-5 py-2.5 font-semibold hover:bg-blue-700 transition">Crear mi tarjeta gratis</Link>
          <Link href="/login" className="border border-zinc-300 text-zinc-700 rounded-lg px-5 py-2.5 font-medium hover:bg-zinc-100 transition">Ingresar</Link>
        </div>
      </section>

      <section className="px-4 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2 text-zinc-900">Que es TINKUY</h2>
        <p className="text-zinc-500 text-center max-w-lg mx-auto mb-10">Una tarjeta de presentacion digital pensada para compartirse al instante, sin imprimir nada.</p>
        <div className="grid sm:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="border border-zinc-100 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold mb-1 text-zinc-900">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 bg-zinc-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-zinc-900">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold mx-auto mb-3">{s.n}</div>
                <h3 className="font-semibold mb-1 text-zinc-900">{s.title}</h3>
                <p className="text-sm text-zinc-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-zinc-900">Lo que dicen los primeros usuarios</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="border border-zinc-100 rounded-2xl p-6 shadow-sm">
              <p className="text-zinc-600 italic mb-3">"{t.quote}"</p>
              <p className="text-sm font-medium text-zinc-400">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-16 text-center bg-zinc-900">
        <h2 className="text-2xl font-bold text-white mb-3">Listo para tener tu propia tarjeta digital</h2>
        <Link href="/register" className="inline-block bg-blue-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-blue-700 transition">Crear mi tarjeta gratis</Link>
      </section>

      <footer className="px-4 py-10 border-t border-zinc-100">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <Logo size="sm" />
            <p className="text-xs text-zinc-400 mt-1">Un proyecto creado por Juan G.</p>
          </div>
          <nav className="flex gap-4 text-sm text-zinc-500">
            <Link href="/" className="hover:text-zinc-900 transition">Inicio</Link>
            <Link href="/register" className="hover:text-zinc-900 transition">Crear cuenta</Link>
            <Link href="/login" className="hover:text-zinc-900 transition">Ingresar</Link>
          </nav>
          <p className="text-xs text-zinc-400">© {year} TINKUY</p>
        </div>
      </footer>
    </main>
  );
}
