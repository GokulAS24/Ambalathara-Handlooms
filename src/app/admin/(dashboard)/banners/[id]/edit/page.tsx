import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BannerForm from "../../BannerForm";
import { updateBanner } from "@/lib/actions/banners.actions";
import { getCategories } from "@/lib/actions/categories.actions";

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [banner, categories] = await Promise.all([
    prisma.heroBanner.findUnique({ where: { id }, include: { category: true } }),
    getCategories(),
  ]);
  if (!banner) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Edit Banner</h1>
      <BannerForm banner={banner} categories={categories} action={updateBanner.bind(null, id)} />
    </div>
  );
}
