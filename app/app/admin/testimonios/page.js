import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import { approveTestimonial, rejectTestimonial } from "@/lib/actions/testimonials";

export default async function AdminTestimoniosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/dashboard");
  }

  const { data: pending } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", false)
    .order("created_at", { ascending: false });

  const { data: approved } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6"><Logo size="sm" /></div>
        <h1 className="text-xl font-bold text-zinc-900 mb-6">Moderar comentarios</h1>

        <h2 className="text-sm font-semibold text-zinc-800 mb-3">Pendientes de aprobar ({pending?.length ?? 0})</h2>
        <div className="space-y-3 mb-10">
          {pending && pending.length > 0 ? pending.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-zinc-200 p-4">
              <p className="text-zinc-700 italic mb-2">"{t.quote}"</p>
              <p className="text-sm font-medium text-zinc-500 mb-3">{t.name}</p>
              <div className="flex gap-2">
                <form action={approveTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit" className="bg-blue-600 text-white text-sm rounded-lg px-3 py-1.5 font-medium hover:bg-blue-700 transition">Aprobar</button>
                </form>
                <form action={rejectTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button type="submit" className="bg-zinc-100 text-zinc-700 text-sm rounded-lg px-3 py-1.5 font-medium hover:bg-zinc-200 transition">Rechazar</button>
                </form>
              </div>
            </div>
          )) : (
            <p className="text-sm text-zinc-400">No hay comentarios pendientes.</p>
          )}
        </div>

        <h2 className="text-sm font-semibold text-zinc-800 mb-3">Publicados ({approved?.length ?? 0})</h2>
        <div className="space-y-3">
          {approved && approved.length > 0 ? approved.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-zinc-200 p-4">
              <p className="text-zinc-700 italic mb-2">"{t.quote}"</p>
              <p className="text-sm font-medium text-zinc-500">{t.name}</p>
            </div>
          )) : (
            <p className="text-sm text-zinc-400">Aun no hay comentarios publicados.</p>
          )}
        </div>
      </div>
    </main>
  );
}
