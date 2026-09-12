"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const field = (name) => formData.get(name)?.toString().trim() || null;

  const firstName = field("first_name");
  const lastName = field("last_name");
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || null;

  const phoneCode = field("phone_code") || "";
  const phoneNumber = field("phone_number");
  const phone = phoneNumber ? `${phoneCode}${phoneNumber.replace(/\D/g, "")}` : null;

  const whatsappCode = field("whatsapp_code") || "";
  const whatsappNumber = field("whatsapp_number");
  const whatsappPhone = whatsappNumber ? `${whatsappCode}${whatsappNumber.replace(/\D/g, "")}` : null;

  const updates = {
    first_name: firstName,
    last_name: lastName,
    full_name: fullName,
    profession: field("profession"),
    position_company: field("position_company"),
    bio: field("bio"),
    phone,
    whatsapp_phone: whatsappPhone,
    tiktok_url: field("tiktok_url"),
    instagram_url: field("instagram_url"),
    facebook_url: field("facebook_url"),
    youtube_url: field("youtube_url"),
    linkedin_url: field("linkedin_url"),
    avatar_url: field("avatar_url"),
    resume_url: field("resume_url"),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    redirect("/dashboard?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?success=1");
}
