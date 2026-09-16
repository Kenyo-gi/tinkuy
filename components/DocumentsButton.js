"use client";

import { useState } from "react";
import { IconFile } from "@/components/Icons";

export default function DocumentsButton({ documents, iconClass }) {
  const [open, setOpen] = useState(false);

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex items-center justify-center gap-2 w-full bg-zinc-100 text-zinc-800 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition"><IconFile className={iconClass} />Ver documentos</button>

      {open && (
        <div className="mt-2 border border-zinc-200 rounded-lg overflow-hidden text-left">
          {documents.map((doc) => (
            <a key={doc.id} href={doc.file_url} target="_blank" rel="noreferrer" className="block px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 border-b border-zinc-100 last:border-b-0">{doc.title}</a>
          ))}
        </div>
      )}
    </div>
  );
}
