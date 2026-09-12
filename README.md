# TINKUY

Tarjeta de presentación digital (Beta). Hecho con Next.js + Supabase.

## Lo que ya funciona en esta versión

- Registro de usuario (email + contraseña + nombre de usuario)
- Login / Logout
- Protección de la ruta `/dashboard` (solo usuarios logueados)
- Cada usuario nuevo crea automáticamente su fila en la tabla `profiles`

Lo que falta (siguientes pasos del plan): editor de la tarjeta, página pública `/u/usuario`, generador de QR y contador de escaneos.

## Cómo desplegarlo (Vercel + GitHub)

1. Crea un repositorio vacío en GitHub llamado `tinkuy` (sin README, sin .gitignore).
2. Sube todo el contenido de esta carpeta a ese repositorio.
3. En Vercel: **Add New → Project → Import** ese repositorio de GitHub.
4. Antes de darle "Deploy", agrega las **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` → tu Project URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → tu Publishable key de Supabase
5. Dale a **Deploy**.

## Cómo correrlo en tu computadora (opcional, para probar antes de subir)

Necesitas tener [Node.js](https://nodejs.org) instalado.

```bash
npm install
cp .env.local.example .env.local
# edita .env.local con tus datos de Supabase
npm run dev
```

Abre http://localhost:3000

## IMPORTANTE: desactivar confirmación de email antes de probar

Este registro crea el perfil en la base de datos justo después de crear la cuenta,
usando la sesión activa del usuario. Pero si Supabase exige confirmar el correo
(así viene por defecto), no hay sesión activa todavía y el registro falla.

Antes de probar, en Supabase ve a **Authentication → Sign In / Providers → Email**
y desactiva **"Confirm email"**. Así el usuario entra apenas se registra.
(Se recomienda reactivarlo más adelante, antes de lanzar la app públicamente,
y en ese momento ajustar el código para manejar la confirmación).
