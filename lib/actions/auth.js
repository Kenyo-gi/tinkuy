"use server";

import { createClient } from "@/lib/supabase/server";
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
