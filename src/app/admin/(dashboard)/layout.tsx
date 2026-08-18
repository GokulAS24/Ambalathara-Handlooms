import Link from "next/link";
import { auth, signOut } from "@/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/settings", label: "Site Settings" },
  { href: "/admin/banners", label: "Hero Banners" },
  { href: "/admin/promos", label: "Promo Blocks" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/team", label: "Admin Team" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen bg-white text-black">
      <aside className="w-56 shrink-0 border-r p-4">
        <p className="mb-6 font-semibold">Admin Panel</p>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm hover:underline">{item.label}</Link>
          ))}
        </nav>
        {session && (
          <div className="mt-8">
            <p className="mb-2 text-xs text-gray-500">{session.user.email}</p>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/admin/login" }); }}>
              <button type="submit" className="text-sm text-red-600">Sign Out</button>
            </form>
          </div>
        )}
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
