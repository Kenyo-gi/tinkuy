import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const SOCIALS = [
  { key: "instagram_url", label: "Instagram", color: "bg-pink-500" },
  { key: "tiktok_url", label: "TikTok", color: "bg-black" },
  { key: "facebook_url", label: "Facebook", color: "bg-blue-600" },
  { key: "youtube_url", label: "YouTube", color: "bg-red-600" },
  { key: "linkedin_url", label: "LinkedIn", color: "bg-sky-700" },
];

export default async function PublicCardPage({ params }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single();

  if (!profile) {
    notFound();
  }

  const whatsappLink = profile.whatsapp_phone ? `https://wa.me/${profile.whatsapp_phone.replace(/\D/g, "")}` : null;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6 text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 overflow-hidden border border-gray-200 mb-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={profile.full_name || profile.username} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
          )}
        </div>

        <h1 className="text-xl font-bold">{profile.full_name || profile.username}</h1>
        {profile.profession && <p className="text-gray-600 mt-1">{profile.profession}</p>}
        {profile.position_company && <p className="text-gray-500 text-sm">{profile.position_company}</p>}

        <div className="mt-6 space-y-2">
          <a href={`/api/vcard/${profile.username}`} className="block w-full bg-black text-white rounded-lg py-2.5 font-medium hover:bg-gray-800 transition">Guardar contacto</a>

          {whatsappLink && (
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="block w-full bg-green-500 text-white rounded-lg py-2.5 font-medium hover:bg-green-600 transition">WhatsApp</a>
          )}

          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="block w-full border border-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition">Llamar: {profile.phone}</a>
          )}

          {profile.email && (
            <a href={`mailto:${profile.email}`} className="block w-full border border-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition">Enviar email</a>
          )}

          {profile.resume_url && (
            <a href={profile.resume_url} target="_blank" rel="noreferrer" className="block w-full border border-gray-300 rounded-lg py-2.5 font-medium hover:bg-gray-50 transition">Ver curriculum</a>
          )}
        </div>

        <div className="mt-6 flex justify-center gap-2 flex-wrap">
          {SOCIALS.map(({ key, label, color }) =>
            profile[key] ? (
              <a key={key} href={profile[key]} target="_blank" rel="noreferrer" className={`${color} text-white text-xs font-medium rounded-full px-4 py-2 hover:opacity-90 transition`}>{label}</a>
            ) : null
          )}
        </div>
      </div>
    </main>
  );
}
