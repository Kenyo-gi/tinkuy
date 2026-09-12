import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) {
    return new NextResponse("No encontrado", { status: 404 });
  }

  const name = profile.full_name || profile.username;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${name}`,
    profile.position_company ? `ORG:${profile.position_company}` : null,
    profile.profession ? `TITLE:${profile.profession}` : null,
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : null,
    profile.email ? `EMAIL:${profile.email}` : null,
    "END:VCARD",
  ].filter(Boolean);

  const vcard = lines.join("\r\n");

  return new NextResponse(vcard, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.username}.vcf"`,
    },
  });
}
