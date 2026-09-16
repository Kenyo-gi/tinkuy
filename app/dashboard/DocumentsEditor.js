"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addDocument, deleteDocument } from "@/lib/actions/documents";

const MAX_PDF_MB = 10;
const MAX_DOCUMENTS = 3;

const CATEGORIES = [
  { value: "curriculum", label: "Curriculum" },
  { value: "catalogo", label: "Catalogo" },
  { value: "portafolio", label: "Portafolio" },
  { value: "flyer", label: "Flyer" },
  { value: "brochure", label: "Brochure" },
  { value: "otro", label: "Otro" },
];

export default function DocumentsEditor({ documents, userId }) {
  const [category, setCategory] = useState("curriculum");
  const [customTitle, setCustomTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const atLimit = documents.length >= MAX_DOCUMENTS;

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    if (file.type !== "application/pdf") {
      setError("El documento debe ser un archivo PDF.");
      return;
    }
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      setError(`El PDF no puede pesar mas de ${MAX_PDF_MB}MB.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const path = `${userId}/doc-${Date.now()}.pdf`;

    const { error: uploadErr } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true });

    if (uploadErr) {
      setError("No se pudo subir el PDF: " + uploadErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("resumes").getPublicUrl(path);
    setFileUrl(data.publicUrl);
    setFileName(file.name);
    setUploading(false);
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-800 mb-3">Documentos (curriculum, catalogo, flyer, etc.)</h2>

      {documents.length > 0 && (
        <ul className="mb-4 space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 text-sm gap-3">
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="text-blue-600 underline truncate">{doc.title}</a>
              <form action={deleteDocument}>
                <input type="hidden" name="id" value={doc.id} />
                <button type="submit" className="text-xs text-red-600 underline shrink-0">Borrar</button>
              </form>
            </li>
          ))}
        </ul>
      )}

      {atLimit ? (
        <p className="text-xs text-zinc-500">Ya tienes el maximo de {MAX_DOCUMENTS} documentos. Borra uno para subir otro.</p>
      ) : (
        <form action={addDocument} className="space-y-3 border border-gray-200 rounded-lg p-3">
          <input type="hidden" name="file_url" value={fileUrl} />
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Tipo de documento</label>
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black">
              {CATEGORIES.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
            </select>
          </div>
          {category === "otro" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nombre del documento</label>
              <input type="text" name="custom_title" value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} maxLength={40} placeholder="Ej: Revista Marzo 2026" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Archivo (PDF)</label>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="text-sm" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Subiendo PDF...</p>}
            {fileName && !uploading && <p className="text-xs text-green-700 mt-1">Listo: {fileName}</p>}
          </div>
          {error && <p className="text-xs text-red-700">{error}</p>}
          <button type="submit" disabled={uploading || !fileUrl} className="bg-zinc-900 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-50">Agregar documento</button>
        </form>
      )}
    </div>
  );
}
