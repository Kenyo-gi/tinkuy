import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold mb-3">TINKUY</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        Tu tarjeta de presentación digital. Comparte tus redes sociales y tus
        datos con un QR (y pronto con NFC).
      </p>
      <div className="flex gap-3">
        <Link
          href="/register"
          className="bg-black text-white rounded-lg px-5 py-2 font-medium hover:bg-gray-800 transition"
        >
          Crear mi tarjeta
        </Link>
        <Link
          href="/login"
          className="border border-gray-300 rounded-lg px-5 py-2 font-medium hover:bg-gray-100 transition"
        >
          Ingresar
        </Link>
      </div>
    </main>
  );
}
