'use client';

import { useMemo, useRef, useState } from 'react';
import { ProductSwatch } from '@/components/site/ProductSwatch';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

type SortMode = 'order' | 'name' | 'status';
const PAGE_SIZE = 8;

/** The product's cover image — its primary item, falling back to the first if none is marked. */
function coverImage(product: Product): string | undefined {
  return (product.items.find((item) => item.isPrimary) ?? product.items[0])?.image;
}

export function ProductList({
  products,
  onEdit,
  onDelete,
  onAddNew,
  onToggleStatus,
  onReorder,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onToggleStatus: (id: string) => void;
  onReorder: (products: Product[]) => void;
}) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortMode>('order');
  const [page, setPage] = useState(0);
  const dragIndex = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = query ? products.filter((p) => p.name.toLowerCase().includes(query)) : products;

    list = [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'status') return a.status.localeCompare(b.status);
      return a.displayOrder - b.displayOrder;
    });

    return list;
  }, [products, search, sort]);

  // Dragging to reorder only makes sense showing every product, in its
  // stored order, with nothing hiding the effect of a drop.
  const reorderable = sort === 'order' && search.trim() === '';

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const paged = filtered.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE);

  const handleDrop = (targetIndexOnPage: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null) return;

    const fromId = paged[from]?.id;
    const toId = paged[targetIndexOnPage]?.id;
    if (!fromId || !toId || fromId === toId) return;

    const next = [...products];
    const fromFullIndex = next.findIndex((p) => p.id === fromId);
    const toFullIndex = next.findIndex((p) => p.id === toId);
    const [moved] = next.splice(fromFullIndex, 1);
    next.splice(toFullIndex, 0, moved);

    onReorder(next.map((product, index) => ({ ...product, displayOrder: index })));
  };

  if (products.length === 0) {
    return (
      <div className="card-handloom flex flex-col items-center gap-4 rounded-sm p-10 text-center shadow-zari">
        <p className="font-sans text-sm text-earth">No products have been added yet.</p>
        <Button type="button" onClick={onAddNew}>
          + Add product
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl text-maroon">Products ({products.length})</h2>
        <Button type="button" onClick={onAddNew} size="sm">
          + Add product
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search products…"
          className="max-w-xs"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="rounded-sm border border-gold/45 bg-white/70 px-3 py-2 font-sans text-sm text-charcoal focus:border-gold focus:outline-none"
        >
          <option value="order">Sort: display order</option>
          <option value="name">Sort: name</option>
          <option value="status">Sort: status</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-earth">No products match &quot;{search}&quot;.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {paged.map((product, index) => {
            const cover = coverImage(product);
            return (
              <li
                key={product.id}
                draggable={reorderable}
                onDragStart={() => {
                  dragIndex.current = index;
                }}
                onDragOver={(e) => reorderable && e.preventDefault()}
                onDrop={() => reorderable && handleDrop(index)}
                className="card-handloom flex items-center gap-4 rounded-sm p-3 shadow-zari"
              >
                {reorderable && (
                  <span
                    className="shrink-0 cursor-grab select-none font-sans text-earth/60"
                    aria-hidden="true"
                    title="Drag to reorder"
                  >
                    ⠿
                  </span>
                )}

                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-sm">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an arbitrary uploaded/pasted image
                    <img src={cover} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ProductSwatch fabric={product.fabric} className="aspect-square h-full w-full" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif text-base text-maroon">{product.name}</p>
                  {product.items.length === 0 ? (
                    <p className="font-sans text-xs font-medium text-maroon">
                      Hidden from customers — no images yet
                    </p>
                  ) : (
                    <p className="font-sans text-xs text-earth">
                      {formatPrice(product.price)} · {product.fabric} · {product.items.length} image
                      {product.items.length === 1 ? '' : 's'}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onToggleStatus(product.id)}
                  className={
                    product.status === 'ACTIVE'
                      ? 'shrink-0 rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-sans text-[0.65rem] uppercase tracking-wide text-gold-dark'
                      : 'shrink-0 rounded-full border border-earth/30 bg-transparent px-3 py-1 font-sans text-[0.65rem] uppercase tracking-wide text-earth/70'
                  }
                  title="Click to toggle"
                >
                  {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                </button>

                <div className="flex shrink-0 gap-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(product)}>
                    Edit
                  </Button>
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="px-2 font-sans text-xs uppercase tracking-wide text-maroon underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {pageCount > 1 && (
        <div className="flex items-center justify-center gap-4 font-sans text-sm text-earth">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => p - 1)}
            className="uppercase tracking-wide underline disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage((p) => p + 1)}
            className="uppercase tracking-wide underline disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductList;
