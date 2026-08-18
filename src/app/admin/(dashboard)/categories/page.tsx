import Link from "next/link";
import { getCategories } from "@/lib/actions/categories.actions";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  const roots = categories.filter((c) => !c.parentId);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <Link href="/admin/categories/new" className="bg-black px-4 py-2 text-sm text-white">New Category</Link>
      </div>
      <ul className="flex flex-col gap-4">
        {roots.map((c) => (
          <li key={c.id}>
            <div className="flex items-center gap-3">
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-gray-400">{c._count.products} products</span>
              <Link href={`/admin/categories/${c.id}/edit`} className="text-sm underline">Edit</Link>
              <DeleteCategoryButton id={c.id} />
            </div>
            <ul className="ml-6 mt-2 flex flex-col gap-1">
              {categories
                .filter((child) => child.parentId === c.id)
                .map((child) => (
                  <li key={child.id} className="flex items-center gap-3 text-sm text-gray-600">
                    – {child.name}
                    <span className="text-xs text-gray-400">{child._count.products} products</span>
                    <Link href={`/admin/categories/${child.id}/edit`} className="underline">Edit</Link>
                    <DeleteCategoryButton id={child.id} />
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
