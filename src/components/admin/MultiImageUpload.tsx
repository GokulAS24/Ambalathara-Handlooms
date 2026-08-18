"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

interface ImageItem {
  id: string;
  url: string;
  uploading: boolean;
}

export default function MultiImageUpload({ name, label }: { name: string; label?: string }) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError(null);

    for (const file of Array.from(fileList)) {
      const id = crypto.randomUUID();
      setImages((prev) => [...prev, { id, url: URL.createObjectURL(file), uploading: true }]);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { id, url: data.url, uploading: false } : img))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setImages((prev) => prev.filter((img) => img.id !== id));
      }
    }
  }

  function handleRemove(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm">{label}</label>}
      <div className="flex flex-wrap gap-3">
        {images.map((img) => (
          <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded border border-gray-300">
            {!img.uploading && <input type="hidden" name={name} value={img.url} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            {img.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="animate-spin text-white" size={18} />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemove(img.id)}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
          <UploadCloud size={20} />
          <span className="text-[10px]">Add images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
