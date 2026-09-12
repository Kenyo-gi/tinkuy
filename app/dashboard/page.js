import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">
            Hola, {profile?.username ?? user.email}
          </h1>
          <form action={logout}>
            <button className="text-sm text-gray-500 underline">
              Cerrar sesion
            </button>
          </form>
        </div>
        <p className="text-gray-600">
          Tu cuenta ya esta creada. El editor de tu tarjeta digital (foto,
          profesion, redes sociales, etc.) lo construimos en el siguiente
          paso.
        </p>
        {profile?.username && (
          <p className="mt-4 text-sm text-gray-500">
            Tu link publico (todavia vacio):{" "}
            <span className="font-mono">/u/{profile.username}</span>
          </p>
        )}
      </div>
    </main>
  );
}
