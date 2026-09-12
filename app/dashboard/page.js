import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import QRCode from "qrcode";
import { getSiteUrl } from "@/lib/site-url";
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

  const siteUrl = await getSiteUrl();
  const publicUrl = profile?.username ? `${siteUrl}/u/${profile.username}` : null;
  const qrTargetUrl = publicUrl ? `${publicUrl}?src=qr` : null;
  const qrDataUrl = qrTargetUrl
    ? await QRCode.toDataURL(qrTargetUrl, { width: 240, margin: 1 })
    : null;

  const { count: totalScans } = await supabase
    .from("scan_events")
    .select("*", { count: "exact", head: true })
    .eq("profile_id", user.id);

  const { data: recentScans } = await supabase
    .from("scan_events")
    .select("scanned_at, source")
    .eq("profile_id", user.id)
    .order("scanned_at", { ascending: false })
    .limit(5);

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

        {qrDataUrl && (
          <div className="mb-6 flex flex-col items-center gap-2 border border-gray-200 rounded-xl p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Codigo QR de tu tarjeta" className="w-40 h-40" />
            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 underline break-all">{publicUrl}</a>
            <a href={qrDataUrl} download="tinkuy-qr.png" className="text-xs font-medium text-blue-600 underline">Descargar QR</a>
          </div>
        )}

        <div className="mb-6 border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-800 mb-2">Estadisticas</h2>
          <p className="text-2xl font-bold">{totalScans ?? 0}</p>
          <p className="text-xs text-gray-500 mb-3">Visitas totales a tu tarjeta</p>
          {recentScans && recentScans.length > 0 ? (
            <ul className="text-xs text-gray-600 space-y-1">
              {recentScans.map((scan, i) => (
                <li key={i}>{new Date(scan.scanned_at).toLocaleString("es-ES")} - {scan.source === "qr" ? "QR" : "Link"}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">Todavia no hay visitas registradas.</p>
          )}
        </div>

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
