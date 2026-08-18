import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [products, categories, banners, promos] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.heroBanner.count(),
    prisma.promoBlock.count(),
  ]);

  const stats = [
    { label: "Products", value: products },
    { label: "Categories", value: categories },
    { label: "Hero Banners", value: banners },
    { label: "Promo Blocks", value: promos },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border p-4">
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
