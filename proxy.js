import { updateSession } from "@/lib/supabase/proxy";

// En Next.js 16 este archivo se llama "proxy.js" (antes "middleware.js").
// Corre en el servidor antes de cada página: aquí refrescamos la sesión
// de Supabase y bloqueamos el acceso a /dashboard si no hay usuario logueado.
export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
