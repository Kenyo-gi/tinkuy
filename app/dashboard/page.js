import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import ProfileEditor from "./ProfileEditor";

export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
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

        {profile?.username && (
          <p className="mb-6 text-sm text-gray-500">
            Tu link publico:{" "}
            <span className="font-mono">/u/{profile.username}</span>
          </p>
        )}

        {params?.success && (
          <p className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Cambios guardados correctamente.
          </p>
        )}
        {params?.error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {params.error}
          </p>
        )}

        <ProfileEditor profile={profile} userId={user.id} />
      </div>
    </main>
  );
}
