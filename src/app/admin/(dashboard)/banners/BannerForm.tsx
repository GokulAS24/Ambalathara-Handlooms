"use client";

import { Category, HeroBanner } from "@prisma/client";
import ImageUpload from "@/components/admin/ImageUpload";

export default function BannerForm({
  banner,
  categories,
  action,
}: {
  banner?: HeroBanner & { category?: Category | null };
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-xl flex-col gap-3">
      <label className="text-sm">Title</label>
      <input name="title" defaultValue={banner?.title} className="border p-2" />

      <label className="text-sm">Subtitle</label>
      <input name="subtitle" defaultValue={banner?.subtitle ?? ""} className="border p-2" />

      <div className="flex flex-wrap gap-6">
        <ImageUpload
          name="desktopImageUrl"
          defaultValue={banner?.desktopImageUrl}
          label="Desktop Image (required)"
        />
        <ImageUpload
          name="mobileImageUrl"
          defaultValue={banner?.mobileImageUrl ?? undefined}
          label="Mobile Image (optional — falls back to desktop)"
        />
      </div>

      <label className="text-sm">CTA Label</label>
      <input name="ctaLabel" defaultValue={banner?.ctaLabel ?? ""} placeholder="e.g. Shop the Collection" className="border p-2" />

      <label className="text-sm">Links to Category</label>
      <select name="categoryId" defaultValue={banner?.categoryId ?? ""} className="border p-2">
        <option value="">None — no link</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <p className="text-xs text-gray-500">
        The CTA button links to this category&apos;s shop page. Only shown when both a CTA Label and a category are set.
      </p>

      <label className="text-sm">Discount Text</label>
      <input name="discountText" defaultValue={banner?.discountText ?? ""} className="border p-2" />

      <label className="text-sm">Order</label>
      <input name="order" type="number" defaultValue={banner?.order ?? 0} className="border p-2" />

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked={banner?.isActive ?? true} />
        Active
      </label>

      <button type="submit" className="mt-2 bg-black py-2 text-white">Save Banner</button>
    </form>
  );
}
