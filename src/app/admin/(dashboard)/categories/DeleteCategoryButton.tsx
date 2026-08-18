"use client";

import { useState, useTransition } from "react";
import { deleteCategory } from "@/lib/actions/categories.actions";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete category");
      }
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        className="text-red-600 disabled:opacity-50"
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </span>
  );
}
