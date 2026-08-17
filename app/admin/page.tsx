import type { Metadata } from 'next';
import { AdminApp } from '@/components/admin/AdminApp';

/**
 * Product management, backed by Supabase (Postgres + Storage) — see
 * lib/adminProducts.ts and components/admin/AdminApp.tsx for the full
 * picture. Writes here are immediately live for every visitor; there is
 * no export/publish step.
 *
 * Never indexed and not linked from anywhere customer-facing. Protected
 * by real Supabase Auth (AdminGate) plus Row Level Security on the
 * database itself — see supabase/migrations/0001_init.sql.
 */
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
