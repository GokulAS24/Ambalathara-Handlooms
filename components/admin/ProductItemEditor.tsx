'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { uploadProductImage } from '@/lib/adminProducts';
import type { ProductItem } from '@/types';

export function ProductItemEditor({
  item,
  productPrice,
  onChange,
  onRemove,
  onSetPrimary,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  item: ProductItem;
  /** The parent product's default price — shown as a preview when this item inherits it. */
  productPrice: number;
  onChange: (patch: Partial<ProductItem>) => void;
  onRemove: () => void;
  onSetPrimary: () => void;
  draggable: boolean;
  onDragStart: () => void;
  onDragOver: (event: React.DragEvent) => void;
  onDrop: () => void;
}) {
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState('');
  const usesCustomPrice = item.price !== null;

  const onUpload = async (file: File | undefined) => {
    if (!file) return;
    setImageBusy(true);
    setImageError('');
    try {
      onChange({ image: await uploadProductImage(file) });
    } catch {
      setImageError('Image upload failed. Please try again.');
    } finally {
      setImageBusy(false);
    }
  };

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="card-handloom flex flex-col gap-3 rounded-sm p-4 shadow-zari sm:flex-row sm:items-start"
    >
      {draggable && (
        <span className="hidden shrink-0 cursor-grab select-none pt-2 font-sans text-earth/60 sm:block" title="Drag to reorder">
          ⠿
        </span>
      )}

      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-gold/30">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary uploaded/pasted image
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream-300 font-sans text-[0.6rem] uppercase text-earth/70">
            No image
          </div>
        )}
        {item.isPrimary && (
          <span className="absolute left-0 top-0 rounded-br-sm bg-maroon px-1.5 py-0.5 font-sans text-[0.55rem] uppercase tracking-wide text-cream-100">
            Cover
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onUpload(e.target.files?.[0])}
          disabled={imageBusy}
          className="font-sans text-xs text-earth file:mr-3 file:rounded-sm file:border file:border-gold/50 file:bg-transparent file:px-3 file:py-1.5 file:font-sans file:text-xs file:uppercase file:tracking-wide file:text-maroon"
        />
        <Input
          value={item.image}
          onChange={(e) => onChange({ image: e.target.value })}
          placeholder="/products/kasavu-saree.jpg"
          disabled={imageBusy}
        />
        {imageBusy && <p className="font-sans text-xs text-earth">Uploading…</p>}
        {imageError && <p className="font-sans text-xs text-maroon">{imageError}</p>}

        <label className="flex flex-col gap-1">
          <span className="font-sans text-[0.65rem] uppercase tracking-wide text-earth">Caption</span>
          <Input
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="e.g. Detail of the woven border"
          />
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 font-sans text-xs text-earth">
            <input
              type="checkbox"
              checked={!usesCustomPrice}
              onChange={(e) => onChange({ price: e.target.checked ? null : productPrice })}
              className="h-3.5 w-3.5 accent-maroon"
            />
            Use product price
          </label>

          {usesCustomPrice && (
            <label className="flex items-center gap-2">
              <span className="font-sans text-xs uppercase tracking-wide text-earth">Custom price (INR)</span>
              <Input
                type="number"
                min={0}
                value={item.price ?? 0}
                onChange={(e) => onChange({ price: Number(e.target.value) })}
                className="w-28"
              />
            </label>
          )}

          <button
            type="button"
            onClick={() => onChange({ status: item.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })}
            className={
              item.status === 'ACTIVE'
                ? 'rounded-full border border-gold/50 bg-gold/10 px-3 py-1 font-sans text-[0.65rem] uppercase tracking-wide text-gold-dark'
                : 'rounded-full border border-earth/30 bg-transparent px-3 py-1 font-sans text-[0.65rem] uppercase tracking-wide text-earth/70'
            }
          >
            {item.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </button>

          {!item.isPrimary && (
            <button
              type="button"
              onClick={onSetPrimary}
              className="font-sans text-xs uppercase tracking-wide text-maroon underline"
            >
              Set as cover
            </button>
          )}

          <button
            type="button"
            onClick={onRemove}
            className="ml-auto font-sans text-xs uppercase tracking-wide text-maroon underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductItemEditor;
