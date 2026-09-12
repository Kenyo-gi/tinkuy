import { createBrowserClient } from "@supabase/ssr";

// Cliente de Supabase para usar DENTRO del navegador (componentes "use client").
// Usa la Publishable Key (segura de exponer en el navegador porque RLS protege los datos).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
