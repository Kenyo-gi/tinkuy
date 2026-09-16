"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const MAX_DOCUMENTS = 3;

const CATEGORY_LABELS = {
  curriculum: "Curriculum",
  catalogo: "Catalogo",
  portafolio: "Portafolio",
  flyer: "Flyer",
  brochure: "Brochure",
};

export async function addDocument(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const category = (formData.get("category") || "").toString();
  const customTitle = (formData.get("custom_title") || "").toString().trim();
  const fileUrl = (formData.get("file_url") || "").toString().trim();

  if (!category || !fileUrl) {
    redirect("/dashboard?doc_error=" + encodeURIComponent("Elige un tipo de documento y sube el archivo."));
  }

  const title = category === "otro" ? (customTitle || "Documento") : (CATEGORY_LABELS[category] || "Documento");

  const { count } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count || 0) >= MAX_DOCUMENTS) {
    redirect("/dashboard?doc_error=" + encodeURIComponent(`Ya tienes el maximo de ${MAX_DOCUMENTS} documentos. Borra uno para subir otro.`));
  }

  const { error } = await supabase.from("documents").insert({
    user_id: user.id,
    category,
    title,
    file_url: fileUrl,
  });

  if (error) {
    redirect("/dashboard?doc_error=" + encodeURIComponent("No se pudo guardar el documento. Intenta de nuevo."));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?doc_success=1");
}

export async function deleteDocument(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id");
  await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard?doc_success=1");
}
