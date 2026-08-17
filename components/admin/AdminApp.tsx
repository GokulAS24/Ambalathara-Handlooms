'use client';

import { useEffect, useState } from 'react';
import { AdminGate } from '@/components/admin/AdminGate';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { ProductsSection } from '@/components/site/ProductsSection';
import { deleteProduct, reorderProducts, updateProductStatus, upsertProduct } from '@/lib/adminProducts';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';

type View = 'list' | 'new' | Product;

export function AdminApp() {
  const { products, loading, error, refetch } = useProducts();
  const [view, setView] = useState<View>('list');
  const [actionError, setActionError] = useState('');
  const [, setBusy] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('admin-page');
    return () => document.documentElement.classList.remove('admin-page');
  }, []);

  const runAction = async (action: () => Promise<void>, failureMessage: string) => {
    setBusy(true);
    setActionError('');
    try {
      await action();
      refetch();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : failureMessage);
    } finally {
      setBusy(false);
    }
  };

  const save = async (product: Product) => {
    await runAction(() => upsertProduct(product), 'Product save failed. Please try again.');
    setView('list');
  };

  const remove = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    if (!window.confirm(`Delete "${product.name}"? This removes all its images too.`)) return;
    runAction(() => deleteProduct(product), 'Product deletion failed. Please try again.');
  };

  const toggleStatus = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const nextStatus = product.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    runAction(() => updateProductStatus(id, nextStatus), 'Status update failed. Please try again.');
  };

  const reorder = (next: Product[]) => {
    runAction(() => reorderProducts(next), 'Reorder failed. Please try again.');
  };

  return (
    <AdminGate>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-12 sm:px-8">
        <header>
          <h1 className="font-serif text-2xl text-maroon">Product admin</h1>
          <p className="mt-2 font-sans text-sm text-earth">
            Changes here save directly to the live catalog — visible to every visitor as soon as
            you save, no publish step.
          </p>
        </header>

        {actionError && (
          <p className="rounded-sm border border-maroon/40 bg-maroon/5 px-4 py-3 font-sans text-sm text-maroon">
            {actionError}
          </p>
        )}

        {loading ? (
          <p className="font-sans text-sm text-earth">Loading products…</p>
        ) : error ? (
          <div>
            <p className="font-sans text-sm text-maroon">{error}</p>
            <button type="button" onClick={refetch} className="mt-2 font-sans text-xs uppercase tracking-wide text-maroon underline">
              Try again
            </button>
          </div>
        ) : (
          <>
            {view === 'list' && (
              <ProductList
                products={products}
                onEdit={setView}
                onDelete={remove}
                onAddNew={() => setView('new')}
                onToggleStatus={toggleStatus}
                onReorder={reorder}
              />
            )}

            {view === 'new' && <ProductForm onSave={save} onCancel={() => setView('list')} />}

            {view !== 'list' && view !== 'new' && (
              <ProductForm initialProduct={view} onSave={save} onCancel={() => setView('list')} />
            )}
          </>
        )}
      </div>

      <div className="border-t border-gold/30">
        <p className="pt-8 text-center font-sans text-xs uppercase tracking-[0.2em] text-gold-dark">
          Live preview — this is the real, public catalog
        </p>
        <ProductsSection />
      </div>
    </AdminGate>
  );
}

export default AdminApp;
