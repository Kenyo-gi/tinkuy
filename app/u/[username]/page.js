import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { getPhoneCountryIso } from "@/lib/phone-flag";
import { IconSaveContact, IconChat, IconPhone, IconMail, IconFile, SocialBadge } from "@/components/Icons";
import Logo from "@/components/Logo";

const SOCIALS = [
  { key: "instagram_url", label: "Instagram", badge: "IG" },
  { key: "tiktok_url", label: "TikTok", badge: "TT" },
  { key: "facebook_url", label: "Facebook", badge: "f" },
  { key: "youtube_url", label: "YouTube", badge: "YT" },
  { key: "linkedin_url", label: "LinkedIn", badge: "in" },
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
  const iconClass = "w-4 h-4 shrink-0";

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden text-center">
        <div className="h-20 bg-zinc-900" />

        <div className="px-6 pb-6">
          <div className="w-24 h-24 mx-auto -mt-12 rounded-full bg-zinc-100 overflow-hidden border-4 border-white shadow-md">
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">Sin foto</div>
            )}
          </div>

          <h1 className="text-xl font-bold mt-3 text-zinc-900">{profile.full_name || profile.username}</h1>
          {profile.profession && <p className="text-zinc-600 mt-1">{profile.profession}</p>}
          {profile.position_company && <p className="text-zinc-500 text-sm">{profile.position_company}</p>}
          {profile.bio && <p className="text-zinc-600 text-sm mt-3">{profile.bio}</p>}

          <div className="mt-6 space-y-2">
            <a href={`/api/vcard/${profile.username}`} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white rounded-lg py-2.5 font-semibold hover:bg-blue-700 transition"><IconSaveContact className={iconClass} />Guardar contacto</a>

            {whatsappLink && (
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-800 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition"><IconChat className={iconClass} />WhatsApp</a>
            )}

            {profile.phone && (
              <a href={`tel:${profile.phone}`} className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-800 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition">{phoneIso && <img src={`https://flagcdn.com/24x18/${phoneIso}.png`} alt={phoneIso} className="w-5 h-[14px] rounded-sm" />}<IconPhone className={iconClass} />Llamar: {profile.phone}</a>
            )}

            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-800 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition"><IconMail className={iconClass} />Enviar email</a>
            )}

            {profile.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-800 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition"><IconFile className={iconClass} />Ver curriculum</a>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            {SOCIALS.map(({ key, label, badge }) =>
              profile[key] ? (
                <a key={key} href={profile[key]} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-zinc-100 text-zinc-800 text-xs font-medium rounded-full pl-1.5 pr-3 py-1.5 hover:bg-zinc-200 transition"><SocialBadge label={badge} />{label}</a>
              ) : null
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-100 flex justify-center">
            <a href="/" className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 transition">
              Hecho por <Logo size="sm" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
