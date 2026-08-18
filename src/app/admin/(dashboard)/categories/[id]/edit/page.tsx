import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CategoryForm from "../../CategoryForm";
import { updateCategory, getCategories } from "@/lib/actions/categories.actions";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [category, parents] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    getCategories(),
  ]);
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Category</h1>
      <CategoryForm category={category} parents={parents} action={updateCategory.bind(null, id)} />
    </div>
  );
}
