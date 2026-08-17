'use client';

import { useRef, useState } from 'react';
import { ProductItemEditor } from '@/components/admin/ProductItemEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { generateId, slugify } from '@/lib/utils';
import type { Product, ProductItem, ProductSpec } from '@/types';

const FABRICS: Product['fabric'][] = ['cotton', 'silk', 'kasavu', 'linen'];

function emptyProduct(): Omit<Product, 'id'> {
  const now = new Date().toISOString();
  return {
    name: '',
    description: '',
    status: 'ACTIVE',
    displayOrder: 0,
    createdAt: now,
    updatedAt: now,
    currency: 'INR',
    fabric: 'cotton',
    specifications: [],
    availability: '',
    delivery: '',
    items: [],
  };
}

function emptyItem(displayOrder: number): ProductItem {
  const now = new Date().toISOString();
  return { id: generateId(), image: '', price: 0, displayOrder, status: 'ACTIVE', createdAt: now, updatedAt: now };
}

const fieldClass =
  'w-full rounded-sm border border-gold/45 bg-white/70 px-4 py-2 font-sans text-sm text-charcoal placeholder:text-earth/70 transition-colors focus:border-gold focus:bg-white focus:outline-none';
const labelClass = 'font-sans text-xs font-medium uppercase tracking-[0.15em] text-earth';

export function ProductForm({
  initialProduct,
  onSave,
  onCancel,
}: {
  initialProduct?: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Omit<Product, 'id'>>(initialProduct ?? emptyProduct());
  const [error, setError] = useState('');
  const dragIndex = useRef<number | null>(null);

  const update = <K extends keyof typeof draft>(key: K, value: (typeof draft)[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const updateSpec = (index: number, patch: Partial<ProductSpec>) =>
    setDraft((current) => ({
      ...current,
      specifications: current.specifications.map((spec, i) => (i === index ? { ...spec, ...patch } : spec)),
    }));

  const addSpec = () =>
    setDraft((current) => ({ ...current, specifications: [...current.specifications, { label: '', value: '' }] }));

  const removeSpec = (index: number) =>
    setDraft((current) => ({
      ...current,
      specifications: current.specifications.filter((_, i) => i !== index),
    }));

  const updateItem = (index: number, patch: Partial<ProductItem>) =>
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, i) =>
        i === index ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item
      ),
    }));

  const addItem = () =>
    setDraft((current) => ({ ...current, items: [...current.items, emptyItem(current.items.length)] }));

  const removeItem = (index: number) =>
    setDraft((current) => ({ ...current, items: current.items.filter((_, i) => i !== index) }));

  const reorderItems = (targetIndex: number) => {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;

    setDraft((current) => {
      const next = [...current.items];
      const [moved] = next.splice(from, 1);
      next.splice(targetIndex, 0, moved);
      return { ...current, items: next.map((item, index) => ({ ...item, displayOrder: index })) };
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (draft.items.length === 0) {
      setError('Add at least one item before saving — a product with none is saved but never shown to customers.');
      return;
    }
    for (const item of draft.items) {
      if (!Number.isFinite(item.price) || item.price < 0) {
        setError('Every item needs a price of 0 or more.');
        return;
      }
    }

    const id = initialProduct?.id ?? (slugify(draft.name) || `product-${Date.now()}`);

    onSave({
      ...draft,
      id,
      updatedAt: new Date().toISOString(),
      specifications: draft.specifications.filter((spec) => spec.label.trim() || spec.value.trim()),
    });
  };

  return (
    <form onSubmit={submit} className="card-handloom flex flex-col gap-5 rounded-sm p-6 shadow-zari sm:p-8">
      <h2 className="font-serif text-xl text-maroon">
        {initialProduct ? 'Edit product' : 'Add product'}
      </h2>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Product name *</span>
          <Input value={draft.name} onChange={(e) => update('name', e.target.value)} required />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Status</span>
          <select
            value={draft.status}
            onChange={(e) => update('status', e.target.value as Product['status'])}
            className={fieldClass}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Fabric</span>
          <select
            value={draft.fabric}
            onChange={(e) => update('fabric', e.target.value as Product['fabric'])}
            className={fieldClass}
          >
            {FABRICS.map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Availability</span>
          <Input
            value={draft.availability}
            onChange={(e) => update('availability', e.target.value)}
            placeholder="e.g. In stock"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Product description</span>
        <textarea
          value={draft.description}
          onChange={(e) => update('description', e.target.value)}
          rows={3}
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>Delivery</span>
        <Input
          value={draft.delivery}
          onChange={(e) => update('delivery', e.target.value)}
          placeholder="e.g. Ships in 2-3 business days"
        />
      </label>

      <div className="flex flex-col gap-2">
        <span className={labelClass}>Specifications</span>
        {draft.specifications.map((spec, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2">
            <Input
              value={spec.label}
              onChange={(e) => updateSpec(index, { label: e.target.value })}
              placeholder="Label, e.g. Fabric"
              className="flex-1"
            />
            <Input
              value={spec.value}
              onChange={(e) => updateSpec(index, { value: e.target.value })}
              placeholder="Value, e.g. 100% cotton"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeSpec(index)}
              className="font-sans text-xs uppercase text-maroon underline"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpec}
          className="self-start font-sans text-xs uppercase tracking-wide text-maroon underline"
        >
          + Add specification
        </button>
      </div>

      <div className="flex flex-col gap-3 border-t border-gold/30 pt-5">
        <div>
          <span className={labelClass}>Product images</span>
          <p className="mt-1 font-sans text-xs text-earth/80">
            Each image is a separately priced item — e.g. a colourway or size. Drag the handle to
            reorder them; the order here is the order customers see.
          </p>
        </div>

        {draft.items.length === 0 && (
          <p className="font-sans text-sm text-earth">No images yet — add at least one below.</p>
        )}

        {draft.items.map((item, index) => (
          <ProductItemEditor
            key={item.id}
            item={item}
            onChange={(patch) => updateItem(index, patch)}
            onRemove={() => removeItem(index)}
            draggable={draft.items.length > 1}
            onDragStart={() => {
              dragIndex.current = index;
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => reorderItems(index)}
          />
        ))}

        <button
          type="button"
          onClick={addItem}
          className="self-start rounded-sm border border-gold/50 px-4 py-2 font-sans text-xs uppercase tracking-wide text-maroon transition-colors hover:bg-gold/10"
        >
          + Add image
        </button>
      </div>

      {error && <p className="font-sans text-sm text-maroon">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit">{initialProduct ? 'Save changes' : 'Add product'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
