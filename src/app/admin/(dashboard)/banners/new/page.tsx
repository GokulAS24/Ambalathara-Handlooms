import BannerForm from "../BannerForm";
import { createBanner } from "@/lib/actions/banners.actions";
import { getCategories } from "@/lib/actions/categories.actions";

export default async function NewBannerPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">New Banner</h1>
      <BannerForm categories={categories} action={createBanner} />
    </div>
  );
}
