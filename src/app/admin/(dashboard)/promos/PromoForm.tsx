"use client";

import { PromoBlock } from "@prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function PromoForm({
  promo,
  action,
}: {
  promo?: PromoBlock;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-3">
      <label className="text-sm">Title</label>
      <input name="title" defaultValue={promo?.title} className="border p-2" />

      <label className="text-sm">Subtitle</label>
      <input name="subtitle" defaultValue={promo?.subtitle ?? ""} className="border p-2" />

      <ImageUpload name="imageUrl" defaultValue={promo?.imageUrl} label="Promo Image" />

      <label className="text-sm">Link Href</label>
      <input name="linkHref" defaultValue={promo?.linkHref} className="border p-2" />

      <label className="text-sm">Order</label>
      <input name="order" type="number" defaultValue={promo?.order ?? 0} className="border p-2" />

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked={promo?.isActive ?? true} />
        Active
      </label>

      <button type="submit" className="mt-2 bg-black py-2 text-white">Save Promo</button>
    </form>
  );
}
