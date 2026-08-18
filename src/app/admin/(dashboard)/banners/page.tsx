import Link from "next/link";
import { getHeroBanners, deleteBanner } from "@/lib/actions/banners.actions";

export default async function AdminBannersPage() {
  const banners = await getHeroBanners();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Hero Banners</h1>
        <Link href="/admin/banners/new" className="bg-black px-4 py-2 text-sm text-white">New Banner</Link>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Title</th>
            <th>Order</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {banners.map((b) => (
            <tr key={b.id} className="border-b">
              <td className="py-2">{b.title}</td>
              <td>{b.order}</td>
              <td>{b.isActive ? "Yes" : "No"}</td>
              <td className="flex gap-3 py-2">
                <Link href={`/admin/banners/${b.id}/edit`} className="underline">Edit</Link>
                <form action={deleteBanner.bind(null, b.id)}>
                  <button type="submit" className="text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
