"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/actions/profile";

const MAX_IMAGE_MB = 5;
const MAX_PDF_MB = 10;

function Field({ label, name, defaultValue, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}

export default function ProfileEditor({ profile, userId }) {
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resume_url || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("La foto debe ser una imagen (JPG, PNG, etc).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setUploadError(`La imagen no puede pesar mas de ${MAX_IMAGE_MB}MB.`);
      return;
    }

    setUploadingAvatar(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      setUploadError("No se pudo subir la foto: " + error.message);
      setUploadingAvatar(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploadingAvatar(false);
  }

  async function handleResumeChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (file.type !== "application/pdf") {
      setUploadError("El curriculum debe ser un archivo PDF.");
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setUploadError(`El PDF no puede pesar mas de ${MAX_PDF_MB}MB.`);
      return;
    }

    setUploadingResume(true);
    const supabase = createClient();
    const path = `${userId}/cv-${Date.now()}.pdf`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true });

    if (error) {
      setUploadError("No se pudo subir el PDF: " + error.message);
      setUploadingResume(false);
      return;
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(path);
    setResumeUrl(data.publicUrl);
    setUploadingResume(false);
  }

  return (
    <form action={updateProfile} className="space-y-8">
      <input type="hidden" name="avatar_url" value={avatarUrl} />
      <input type="hidden" name="resume_url" value={resumeUrl} />

      {/* Foto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Foto de perfil
        </label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-[10px] text-center px-1">
                Sin foto
              </span>
            )}
          </div>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm"
            />
            {uploadingAvatar && (
              <p className="text-xs text-gray-500 mt-1">Subiendo foto...</p>
            )}
          </div>
        </div>
      </div>

      {/* Datos personales */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Nombres"
          name="full_name"
          defaultValue={profile?.full_name}
          placeholder="Juan Guillermo"
        />
        <Field
          label="Profesion"
          name="profession"
          defaultValue={profile?.profession}
          placeholder="Ingeniero Industrial"
        />
        <Field
          label="Cargo y empresa"
          name="position_company"
          defaultValue={profile?.position_company}
          placeholder="Gerente en Vitalis Prime"
        />
        <Field
          label="Telefono"
          name="phone"
          defaultValue={profile?.phone}
          placeholder="+34 600 000 000"
        />
        <Field
          label="WhatsApp"
          name="whatsapp_phone"
          defaultValue={profile?.whatsapp_phone}
          placeholder="34600000000 (con codigo de pais, sin espacios)"
        />
      </div>

      {/* Curriculum */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Curriculum profesional (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleResumeChange}
          className="text-sm"
        />
        {uploadingResume && (
          <p className="text-xs text-gray-500 mt-1">Subiendo PDF...</p>
        )}
        {resumeUrl && (
          <a href={resumeUrl} target="_blank" rel="noreferrer" className="block mt-1 text-xs text-blue-600 underline">Ver curriculum actual</a>
        )}
      </div>

      {/* Redes sociales */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-3">
          Redes sociales
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="TikTok"
            name="tiktok_url"
            defaultValue={profile?.tiktok_url}
            placeholder="https://tiktok.com/@usuario"
          />
          <Field
            label="Instagram"
            name="instagram_url"
            defaultValue={profile?.instagram_url}
            placeholder="https://instagram.com/usuario"
          />
          <Field
            label="Facebook"
            name="facebook_url"
            defaultValue={profile?.facebook_url}
            placeholder="https://facebook.com/usuario"
          />
          <Field
            label="YouTube"
            name="youtube_url"
            defaultValue={profile?.youtube_url}
            placeholder="https://youtube.com/@usuario"
          />
          <Field
            label="LinkedIn"
            name="linkedin_url"
            defaultValue={profile?.linkedin_url}
            placeholder="https://linkedin.com/in/usuario"
          />
        </div>
      </div>

      {uploadError && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {uploadError}
        </p>
      )}

      <button type="submit" disabled={uploadingAvatar || uploadingResume} className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-white rounded-lg px-5 py-2 font-medium hover:opacity-90 transition disabled:opacity-50">Guardar cambios</button>
    </form>
  );
}
