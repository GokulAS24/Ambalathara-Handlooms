"use client";

import { Category } from "@prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function CategoryForm({
  category,
  parents,
  action,
}: {
  category?: Category;
  parents: Category[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-3">
      <label className="text-sm">Name</label>
      <input name="name" defaultValue={category?.name} required className="border p-2" />

      <label className="text-sm">Description</label>
      <textarea name="description" defaultValue={category?.description ?? ""} className="border p-2" />

      <ImageUpload name="imageUrl" defaultValue={category?.imageUrl ?? undefined} label="Category Image" />

      <label className="text-sm">Parent Category</label>
      <select name="parentId" defaultValue={category?.parentId ?? ""} className="border p-2">
        <option value="">None (top-level)</option>
        {parents
          .filter((p) => p.id !== category?.id)
          .map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
      </select>

      <label className="text-sm">Order</label>
      <input name="order" type="number" defaultValue={category?.order ?? 0} className="border p-2" />

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} />
        Active
      </label>

      <button type="submit" className="mt-2 bg-black py-2 text-white">Save Category</button>
    </form>
  );
}
