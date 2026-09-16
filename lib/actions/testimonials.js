"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function submitTestimonial(formData) {
  const name = (formData.get("name") || "").toString().trim();
  const quote = (formData.get("quote") || "").toString().trim();

  if (!name || !quote) {
    redirect("/opinion?error=" + encodeURIComponent("Completa tu nombre y tu comentario."));
  }
  if (quote.length > 300) {
    redirect("/opinion?error=" + encodeURIComponent("El comentario no puede pasar de 300 caracteres."));
  }

  const supabase = await createClient();
  const { error } = await supabase.from("testimonials").insert({ name, quote });

  if (error) {
    redirect("/opinion?error=" + encodeURIComponent("No se pudo enviar tu comentario. Intenta de nuevo."));
  }

  redirect("/opinion?success=1");
}

export async function approveTestimonial(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("testimonials").update({ approved: true }).eq("id", id);
  redirect("/admin/testimonios");
}

export async function rejectTestimonial(formData) {
  const id = formData.get("id");
  const supabase = await createClient();
  await supabase.from("testimonials").delete().eq("id", id);
  redirect("/admin/testimonios");
}
