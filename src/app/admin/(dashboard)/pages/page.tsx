import Link from "next/link";
import { getAllPages } from "@/lib/actions/pages.actions";

export default async function AdminPagesListPage() {
  const pages = await getAllPages();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Pages</h1>
      <ul className="flex flex-col gap-2">
        {pages.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/pages/${p.slug}`} className="underline">
              {p.title} ({p.sections.length} sections)
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
