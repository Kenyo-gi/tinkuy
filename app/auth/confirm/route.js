import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Ruta a la que llega el link del correo de recuperacion de contrasena.
// Intercambia el codigo por una sesion valida y luego manda al usuario
// a la pagina donde escribe su nueva contrasena.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/reset-password";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      redirect(next);
    }
  }

  redirect(
    "/login?error=" +
      encodeURIComponent("El enlace no es valido o ya expiro. Solicita uno nuevo.")
  );
}
