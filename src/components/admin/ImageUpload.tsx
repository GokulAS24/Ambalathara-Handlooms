"use client";

import { useState, ChangeEvent } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";

export default function ImageUpload({
  name,
  defaultValue,
  label,
}: {
  name: string;
  defaultValue?: string;
  label?: string;
}) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setValue(data.url);
      setPreview(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(defaultValue ?? null);
      setValue(defaultValue ?? "");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    setPreview(null);
    setValue("");
  }

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm">{label}</label>}
      <input type="hidden" name={name} value={value} />

      {preview ? (
        <div className="relative h-40 w-40 overflow-hidden rounded border border-gray-300">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="animate-spin text-white" size={24} />
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Remove image"
            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-40 cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
          <UploadCloud size={24} />
          <span className="text-xs">Upload image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
