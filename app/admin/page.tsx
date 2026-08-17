import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

/**
 * Product management, front-end only — no database, no server-side
 * storage. See lib/adminProducts.ts and components/admin/AdminApp.tsx for
 * the full picture: this page edits a draft in the browser's own
 * localStorage, previewed live below via the real ProductsSection, and
 * exported as lib/products.ts source when ready to actually publish.
 *
 * Never indexed and not linked from anywhere customer-facing — the only
 * thing standing between a stranger and this page is AdminGate's password
 * check, which is explicitly not real security (see its own comment).
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
