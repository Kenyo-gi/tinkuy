import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPhoneCountryIso } from "@/lib/phone-flag";

const SOCIALS = [
  { key: "instagram_url", label: "Instagram", color: "bg-pink-500" },
  { key: "tiktok_url", label: "TikTok", color: "bg-black" },
  { key: "facebook_url", label: "Facebook", color: "bg-blue-600" },
  { key: "youtube_url", label: "YouTube", color: "bg-red-600" },
  { key: "linkedin_url", label: "LinkedIn", color: "bg-sky-700" },
];

export default async function PublicCardPage({ params, searchParams }) {
  const { username } = await params;
  const sp = await searchParams;
  const source = sp?.src === "qr" ? "qr" : "link";
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single();

  if (!profile) {
    notFound();
  }

  try {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || null;
    await supabase.from("scan_events").insert({
      profile_id: profile.id,
      source,
      user_agent: userAgent,
    });
  } catch {
    // no bloquear la carga de la tarjeta si falla el registro del escaneo
  }

  const whatsappLink = profile.whatsapp_phone ? `https://wa.me/${profile.whatsapp_phone.replace(/\D/g, "")}` : null;
  const phoneIso = getPhoneCountryIso(profile.phone);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden text-center">
        <div className="h-20 bg-gradient-to-r from-indigo-600 to-fuchsia-500" />

        <div className="px-6 pb-6">
          <div className="w-24 h-24 mx-auto -mt-12 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-md">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
            )}
          </div>

          <h1 className="text-xl font-bold mt-3">{profile.full_name || profile.username}</h1>
          {profile.profession && <p className="text-gray-600 mt-1">{profile.profession}</p>}
          {profile.position_company && <p className="text-gray-500 text-sm">{profile.position_company}</p>}
          {profile.bio && <p className="text-gray-600 text-sm mt-3">{profile.bio}</p>}

          <div className="mt-6 space-y-2">
            <a href={`/api/vcard/${profile.username}`} className="block w-full bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white rounded-lg py-2.5 font-medium hover:opacity-90 transition">Guardar contacto</a>

            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full bg-green-500 text-white rounded-lg py-2.5 font-medium hover:bg-green-600 transition">WhatsApp</a>
            )}

            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center justify-center gap-2 w-full border border-indigo-200 text-indigo-700 rounded-lg py-2.5 font-medium hover:bg-indigo-50 transition">{phoneIso && <img src={`https://flagcdn.com/24x18/${phoneIso}.png`} alt={phoneIso} className="w-6 h-[18px] rounded-sm" />}<span>📞 Llamar: {profile.phone}</span></a>
            )}

            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center justify-center gap-2 w-full border border-blue-200 text-blue-700 rounded-lg py-2.5 font-medium hover:bg-blue-50 transition"><span>✉️</span><span>Enviar email</span></a>
            )}

            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full border border-emerald-200 text-emerald-700 rounded-lg py-2.5 font-medium hover:bg-emerald-50 transition"><span>📄</span><span>Ver curriculum</span></a>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {SOCIALS.map(({ key, label, color }) =>
              profile[key] ? (
                <a key={key} href={profile[key]} target="_blank" rel="noreferrer" className={`${color} text-white text-xs font-medium rounded-full px-4 py-2 hover:opacity-90 transition`}>{label}</a>
              ) : null
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100">
            <a href="/" className="text-xs text-gray-400 hover:text-gray-600 transition">
              Hecho por{" "}
              <span className="font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">TINKUY APP</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
