import "./globals.css";

export const metadata = {
  title: "TINKUY — Tu tarjeta de presentación digital",
  description: "Comparte tus datos y redes sociales con un QR (y pronto NFC).",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
