import CategoryForm from "../CategoryForm";
import { createCategory, getCategories } from "@/lib/actions/categories.actions";

export default async function NewCategoryPage() {
  const parents = await getCategories();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New Category</h1>
      <CategoryForm parents={parents} action={createCategory} />
    </div>
  );
}
