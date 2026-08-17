'use client';

import { useEffect, useState } from 'react';
import { AdminGate } from '@/components/admin/AdminGate';
import { ExportPanel } from '@/components/admin/ExportPanel';
import { ProductForm } from '@/components/admin/ProductForm';
import { ProductList } from '@/components/admin/ProductList';
import { ProductsSection } from '@/components/site/ProductsSection';
import { clearAdminProducts, loadAdminProducts, saveAdminProducts } from '@/lib/adminProducts';
import { PRODUCTS } from '@/lib/products';
import type { Product } from '@/types';

type View = 'list' | 'new' | Product;

export function AdminApp() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [view, setView] = useState<View>('list');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setProducts(loadAdminProducts() ?? PRODUCTS);
  }, []);

  useEffect(() => {
    // html/body default to overflow:hidden (see globals.css) for the
    // countdown page's one-viewport layout, which normally gets undone by
    // LaunchGate's `site-launched` class once the main site takes over.
    // /admin never mounts LaunchGate, so without this it inherits that
    // overflow:hidden with nothing to turn it off — this page is far
    // taller than one viewport (product list, form, export panel, and a
    // full embedded site preview) and needs to actually scroll.
    document.documentElement.classList.add('admin-page');
    return () => document.documentElement.classList.remove('admin-page');
  }, []);

  /**
   * Every mutation goes through here: update local state, then persist.
   * `saveAdminProducts` writes to localStorage, which can throw (quota
   * exceeded — most likely from a lot of uploaded, unresized-by-mistake
   * images) — caught here so a failed save surfaces a message instead of
   * silently losing the edit.
   */
  const persist = (next: Product[]) => {
    setProducts(next);
    try {
      saveAdminProducts(next);
      setSaveError('');
    } catch {
      setSaveError('Could not save — your browser storage may be full. Try removing an image or two.');
    }
  };

  const save = (product: Product) => {
    const next = products.some((p) => p.id === product.id)
      ? products.map((p) => (p.id === product.id ? product : p))
      : [...products, product];
    persist(next);
    setView('list');
  };

  const remove = (id: string) => {
    if (!window.confirm('Delete this product? This removes all its images too, and only affects your local draft.')) return;
    persist(products.filter((p) => p.id !== id));
  };

  const toggleStatus = (id: string) => {
    persist(
      products.map((p) => (p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : p))
    );
  };

  const reset = () => {
    clearAdminProducts();
    setProducts(PRODUCTS);
    setSaveError('');
    setView('list');
  };

  return (
    <AdminGate>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-12 sm:px-8">
        <header>
          <h1 className="font-serif text-2xl text-maroon">Product admin</h1>
          <p className="mt-2 font-sans text-sm text-earth">
            Changes here save to this browser only. See &quot;Publish these changes&quot; below
            to make them visible to real visitors.
          </p>
        </header>

        {saveError && (
          <p className="rounded-sm border border-maroon/40 bg-maroon/5 px-4 py-3 font-sans text-sm text-maroon">
            {saveError}
          </p>
        )}

        {view === 'list' && (
          <ProductList
            products={products}
            onEdit={setView}
            onDelete={remove}
            onAddNew={() => setView('new')}
            onToggleStatus={toggleStatus}
            onReorder={persist}
          />
        )}

        {view === 'new' && <ProductForm onSave={save} onCancel={() => setView('list')} />}

        {view !== 'list' && view !== 'new' && (
          <ProductForm initialProduct={view} onSave={save} onCancel={() => setView('list')} />
        )}

        <ExportPanel products={products} onReset={reset} />
      </div>

      <div className="border-t border-gold/30">
        <p className="pt-8 text-center font-sans text-xs uppercase tracking-[0.2em] text-gold-dark">
          Live preview — this browser only
        </p>
        <ProductsSection />
      </div>
    </AdminGate>
  );
}

export default AdminApp;
