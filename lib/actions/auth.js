"use server";

import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/site-url";
import { redirect } from "next/navigation";

// Reglas simples para el nombre de usuario (será tu URL pública: tinkuy.app/u/usuario)
const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/;

export async function register(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();
  const username = formData.get("username")?.toString().trim().toLowerCase();

  if (!username || !USERNAME_REGEX.test(username)) {
    redirect(
      "/register?error=" +
        encodeURIComponent(
          "El usuario debe tener 3-30 caracteres: minusculas, numeros, - o _"
        )
    );
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing) {
    redirect(
      "/register?error=" +
        encodeURIComponent("Ese nombre de usuario ya esta en uso, elige otro.")
    );
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/register?error=" + encodeURIComponent(error.message));
  }

  if (!data.user) {
    redirect(
      "/register?error=" +
        encodeURIComponent("No se pudo crear la cuenta. Intenta de nuevo.")
    );
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    username,
    email,
  });

  if (profileError) {
    const message =
      profileError.code === "23505"
        ? "Ese nombre de usuario ya esta en uso, elige otro."
        : profileError.message;
    redirect("/register?error=" + encodeURIComponent(message));
  }

  redirect("/dashboard");
}

export async function login(formData) {
  const email = formData.get("email")?.toString().trim();
  const password = formData.get("password")?.toString();

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(
      "/login?error=" + encodeURIComponent("Correo o contrasena incorrectos")
    );
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData) {
  const email = formData.get("email")?.toString().trim();

  if (!email) {
    redirect("/forgot-password?error=" + encodeURIComponent("Ingresa tu correo."));
  }

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/confirm?next=/reset-password`,
  });

  // Mensaje siempre igual, exista o no ese correo, para no revelar que emails estan registrados.
  redirect("/forgot-password?success=1");
}

export async function updatePassword(formData) {
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  if (!password || password.length < 6) {
    redirect(
      "/reset-password?error=" +
        encodeURIComponent("La contrasena debe tener al menos 6 caracteres.")
    );
  }
  if (password !== confirmPassword) {
    redirect(
      "/reset-password?error=" + encodeURIComponent("Las contrasenas no coinciden.")
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/reset-password?error=" + encodeURIComponent(error.message));
  }

  redirect(
    "/login?success=" +
      encodeURIComponent("Tu contrasena se actualizo. Ya puedes iniciar sesion.")
  );
}
