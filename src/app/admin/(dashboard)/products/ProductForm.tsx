"use client";

import { Category, Product } from "@prisma/client";
import MultiImageUpload from "@/components/admin/MultiImageUpload";

export default function ProductForm({
  product,
  categories,
  action,
}: {
  product?: Product;
  categories: Category[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-3">
      <label className="text-sm">Name</label>
      <input name="name" defaultValue={product?.name} required className="border p-2" />

      <label className="text-sm">Description</label>
      <textarea name="description" defaultValue={product?.description} required className="border p-2" />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Price (₹)</label>
          <input name="price" type="number" step="0.01" defaultValue={product?.price} required className="w-full border p-2" />
        </div>
        <div>
          <label className="text-sm">Compare-at Price (₹)</label>
          <input name="compareAtPrice" type="number" step="0.01" defaultValue={product?.compareAtPrice ?? ""} className="w-full border p-2" />
        </div>
      </div>

      <label className="text-sm">Stock</label>
      <input name="stock" type="number" defaultValue={product?.stock ?? 0} required className="border p-2" />

      <label className="text-sm">Category</label>
      <select name="categoryId" defaultValue={product?.categoryId} required className="border p-2">
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Weave Type</label>
          <input name="weaveType" defaultValue={product?.weaveType ?? ""} className="w-full border p-2" />
        </div>
        <div>
          <label className="text-sm">Fabric</label>
          <input name="fabric" defaultValue={product?.fabric ?? ""} className="w-full border p-2" />
        </div>
        <div>
          <label className="text-sm">Pattern</label>
          <input name="pattern" defaultValue={product?.pattern ?? ""} className="w-full border p-2" />
        </div>
        <div>
          <label className="text-sm">Wash Care</label>
          <input name="washCare" defaultValue={product?.washCare ?? ""} className="w-full border p-2" />
        </div>
      </div>

      {!product && <MultiImageUpload name="imageUrls" label="Product Images" />}

      <label className="flex items-center gap-2 text-sm">
        <input name="isActive" type="checkbox" defaultChecked={product?.isActive ?? true} />
        Active
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} />
        Featured
      </label>

      <button type="submit" className="mt-2 bg-black py-2 text-white">Save Product</button>
    </form>
  );
}
