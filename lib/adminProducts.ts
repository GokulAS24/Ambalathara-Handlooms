import { supabase } from '@/lib/supabase/client';
import type { Product, ProductItem } from '@/types';

/**
 * All product persistence, for both the public catalog and the admin
 * panel — Supabase Postgres is the single source of truth (see
 * supabase/migrations/0001_init.sql for the schema/RLS). No browser
 * storage holds product data; the only thing that ever touches
 * localStorage now is the Supabase Auth SDK's own session token, which is
 * its standard, expected behaviour for keeping an admin signed in between
 * visits — not something this file manages.
 */

type ProductRow = {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  display_order: number;
  price: number;
  fabric: Product['fabric'];
  specifications: Product['specifications'];
  availability: string;
  delivery: string;
  created_at: string;
  updated_at: string;
};

type ProductItemRow = {
  id: string;
  product_id: string;
  image: string;
  description: string;
  price: number | null;
  is_primary: boolean;
  display_order: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
};

function toProduct(row: ProductRow, items: ProductItemRow[]): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    displayOrder: row.display_order,
    price: Number(row.price),
    fabric: row.fabric,
    specifications: row.specifications ?? [],
    availability: row.availability,
    delivery: row.delivery,
    currency: 'INR',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items
      .filter((item) => item.product_id === row.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(toProductItem),
  };
}

function toProductItem(row: ProductItemRow): ProductItem {
  return {
    id: row.id,
    image: row.image,
    description: row.description,
    price: row.price === null ? null : Number(row.price),
    isPrimary: row.is_primary,
    displayOrder: row.display_order,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Every product with every item, regardless of status — RLS gives an
 * anonymous visitor only ACTIVE rows and a signed-in admin everything, so
 * this same query is safe to call from both the public catalog and the
 * admin panel; the database enforces the difference, not this code.
 */
export async function fetchProducts(): Promise<Product[]> {
  const [{ data: products, error: productsError }, { data: items, error: itemsError }] = await Promise.all([
    supabase.from('products').select('*').order('display_order', { ascending: true }),
    supabase.from('product_items').select('*').order('display_order', { ascending: true }),
  ]);

  if (productsError) throw productsError;
  if (itemsError) throw itemsError;

  return (products ?? []).map((row) => toProduct(row as ProductRow, (items ?? []) as ProductItemRow[]));
}

/**
 * Upserts the product row, then replaces its items wholesale (delete all,
 * reinsert the current list). Simple and correct for the item counts this
 * catalog actually has (a handful per product) — not wrapped in a single
 * DB transaction, so a failure between the delete and the reinsert could
 * theoretically leave a product briefly item-less; acceptable for a
 * low-traffic, single-admin panel, not for a high-concurrency store.
 */
/**
 * Guards the one way this schema could silently balloon: a raw base64
 * data: URL landing in the `image` column instead of a Storage URL. That
 * happened for real once already — a since-removed "import old localStorage
 * drafts" feature wrote pre-migration data-URL images straight into
 * Postgres unmodified (100-280KB of text per row, no CDN caching, no
 * Storage cleanup on delete). The image field also accepts free-typed text
 * (ProductItemEditor's manual URL input), so this check belongs at the
 * write boundary, not just at that one now-deleted entry point.
 */
function assertNoDataUrlImages(product: Product): void {
  const offender = product.items.find((item) => item.image.startsWith('data:'));
  if (offender) {
    throw new Error(
      `"${product.name}" has an image saved as raw embedded data instead of an uploaded file. Re-upload it via the file picker before saving.`
    );
  }
}

export async function upsertProduct(product: Product): Promise<void> {
  assertNoDataUrlImages(product);

  const { error: productError } = await supabase.from('products').upsert({
    id: product.id,
    name: product.name,
    description: product.description,
    status: product.status,
    display_order: product.displayOrder,
    price: product.price,
    fabric: product.fabric,
    specifications: product.specifications,
    availability: product.availability,
    delivery: product.delivery,
  });
  if (productError) throw productError;

  const { error: deleteError } = await supabase.from('product_items').delete().eq('product_id', product.id);
  if (deleteError) throw deleteError;

  if (product.items.length > 0) {
    const { error: insertError } = await supabase.from('product_items').insert(
      product.items.map((item) => ({
        id: item.id,
        product_id: product.id,
        image: item.image,
        description: item.description,
        price: item.price,
        is_primary: item.isPrimary,
        display_order: item.displayOrder,
        status: item.status,
      }))
    );
    if (insertError) throw insertError;
  }
}

export async function updateProductStatus(id: string, status: Product['status']): Promise<void> {
  const { error } = await supabase.from('products').update({ status }).eq('id', id);
  if (error) throw error;
}

/** Bulk display-order update after a drag-reorder in the admin list. */
export async function reorderProducts(products: Product[]): Promise<void> {
  const results = await Promise.all(
    products.map((product) =>
      supabase.from('products').update({ display_order: product.displayOrder }).eq('id', product.id)
    )
  );
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;
}

/**
 * Deletes the product (its items cascade via the FK) and best-effort
 * cleans up any Storage-hosted images so deleted products don't leave
 * orphaned files behind.
 */
export async function deleteProduct(product: Product): Promise<void> {
  await Promise.all(product.items.map((item) => deleteProductImage(item.image)));
  const { error } = await supabase.from('products').delete().eq('id', product.id);
  if (error) throw error;
}

/** Long edge cap for uploaded product photos, applied before they're uploaded. */
const MAX_IMAGE_DIMENSION = 1000;
const IMAGE_QUALITY = 0.82;
const STORAGE_BUCKET = 'product-images';

/** Resizes an uploaded image client-side (canvas) to a JPEG blob, ready to upload. */
function resizeImageToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))),
          'image/jpeg',
          IMAGE_QUALITY
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Resizes then uploads to Supabase Storage, returning the public URL to store on the item. */
export async function uploadProductImage(file: File): Promise<string> {
  const blob = await resizeImageToBlob(file);
  const path = `${crypto.randomUUID()}.jpg`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Best-effort delete of a Storage-hosted image. Silently no-ops for
 * anything that isn't one of our own Storage URLs (an admin-typed
 * `/products/...` path, or the empty placeholder-swatch state) — there's
 * nothing in Storage to clean up for those.
 */
export async function deleteProductImage(url: string): Promise<void> {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;

  const path = url.slice(index + marker.length);
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}
