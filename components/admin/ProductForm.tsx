'use client';

import { useRef, useState } from 'react';
import { ProductItemEditor } from '@/components/admin/ProductItemEditor';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { uploadProductImage } from '@/lib/adminProducts';
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
    price: 0,
    fabric: 'cotton',
    specifications: [],
    availability: '',
    delivery: '',
    items: [],
  };
}

function emptyItem(displayOrder: number, isPrimary: boolean): ProductItem {
  return emptyItemWithImage(displayOrder, isPrimary, '');
}

function emptyItemWithImage(displayOrder: number, isPrimary: boolean, image: string): ProductItem {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    image,
    description: '',
    price: null,
    isPrimary,
    displayOrder,
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };
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
  onSave: (product: Product) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Omit<Product, 'id'>>(initialProduct ?? emptyProduct());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dragIndex = useRef<number | null>(null);
  const [bulkUpload, setBulkUpload] = useState<{ total: number; completed: number } | null>(null);
  const [bulkFailures, setBulkFailures] = useState<File[]>([]);

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
    setDraft((current) => ({
      ...current,
      items: [...current.items, emptyItem(current.items.length, current.items.length === 0)],
    }));

  const removeItem = (index: number) =>
    setDraft((current) => {
      const removed = current.items[index];
      const items = current.items.filter((_, i) => i !== index);
      if (removed?.isPrimary && items.length > 0) items[0] = { ...items[0], isPrimary: true };
      return { ...current, items };
    });

  const setPrimaryItem = (index: number) =>
    setDraft((current) => ({
      ...current,
      items: current.items.map((item, i) => ({ ...item, isPrimary: i === index })),
    }));

  /**
   * Bulk multi-select upload: files are resized/uploaded sequentially
   * (Supabase Storage's SDK gives no combined-batch call, and doing all of
   * them at once risks the browser throttling many parallel canvas resizes
   * on a low-end admin device) — each success appends a new item
   * immediately, so partial progress is never lost if a later file fails.
   */
  const uploadMany = async (files: File[]) => {
    setBulkFailures([]);
    setBulkUpload({ total: files.length, completed: 0 });
    const failed: File[] = [];

    for (const file of files) {
      try {
        const image = await uploadProductImage(file);
        setDraft((current) => ({
          ...current,
          items: [...current.items, emptyItemWithImage(current.items.length, current.items.length === 0, image)],
        }));
      } catch {
        failed.push(file);
      } finally {
        setBulkUpload((current) => (current ? { ...current, completed: current.completed + 1 } : current));
      }
    }

    setBulkFailures(failed);
    setBulkUpload(null);
  };

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

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!draft.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (draft.items.length === 0) {
      setError('Add at least one image before saving — a product with none is saved but never shown to customers.');
      return;
    }
    if (!Number.isFinite(draft.price) || draft.price < 0) {
      setError('Product price must be 0 or more.');
      return;
    }
    for (const item of draft.items) {
      if (item.price !== null && (!Number.isFinite(item.price) || item.price < 0)) {
        setError('Every custom image price needs to be 0 or more.');
        return;
      }
    }

    const id = initialProduct?.id ?? (slugify(draft.name) || `product-${Date.now()}`);
    const hasPrimary = draft.items.some((item) => item.isPrimary);

    setSaving(true);
    try {
      await onSave({
        ...draft,
        id,
        updatedAt: new Date().toISOString(),
        specifications: draft.specifications.filter((spec) => spec.label.trim() || spec.value.trim()),
        items: hasPrimary
          ? draft.items
          : draft.items.map((item, index) => ({ ...item, isPrimary: index === 0 })),
      });
    } finally {
      setSaving(false);
    }
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
          <span className={labelClass}>Price (INR) *</span>
          <Input
            type="number"
            min={0}
            value={draft.price || ''}
            onChange={(e) => update('price', Number(e.target.value))}
            required
          />
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
            Select several photos at once to upload them together. Each image can carry its own
            caption and, if needed, its own price — otherwise it uses the product price above. Drag
            the handle to reorder; the cover image is what customers see on the collection grid.
          </p>
        </div>

        <label className="self-start rounded-sm border border-gold/50 bg-gold/5 px-4 py-2 font-sans text-xs uppercase tracking-wide text-maroon transition-colors hover:bg-gold/10">
          {bulkUpload ? `Uploading photo ${bulkUpload.completed + 1} of ${bulkUpload.total}…` : 'Select multiple images'}
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={!!bulkUpload}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = '';
              if (files.length > 0) uploadMany(files);
            }}
            className="hidden"
          />
        </label>

        {bulkFailures.length > 0 && (
          <div className="rounded-sm border border-maroon/40 bg-maroon/5 px-4 py-3 font-sans text-xs text-maroon">
            <p>{bulkFailures.length} image{bulkFailures.length === 1 ? '' : 's'} failed to upload:</p>
            <ul className="mt-1 list-disc pl-4">
              {bulkFailures.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => uploadMany(bulkFailures)}
              className="mt-2 uppercase tracking-wide underline"
            >
              Retry failed uploads
            </button>
          </div>
        )}

        {draft.items.length === 0 && (
          <p className="font-sans text-sm text-earth">No images yet — select some above, or add one manually.</p>
        )}

        {draft.items.map((item, index) => (
          <ProductItemEditor
            key={item.id}
            item={item}
            productPrice={draft.price}
            onChange={(patch) => updateItem(index, patch)}
            onRemove={() => removeItem(index)}
            onSetPrimary={() => setPrimaryItem(index)}
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
          className="self-start font-sans text-xs uppercase tracking-wide text-maroon underline"
        >
          + Add one manually
        </button>
      </div>

      {error && <p className="font-sans text-sm text-maroon">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : initialProduct ? 'Save changes' : 'Add product'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
