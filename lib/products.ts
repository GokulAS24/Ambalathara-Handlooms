import type { Product } from '@/types';

const SEED_TIMESTAMP = '2026-08-17T00:00:00.000Z';

/**
 * The product catalog — the one place to edit names, descriptions and
 * items. `image` is left empty on every placeholder item on purpose:
 * ProductItemCard/ProductImageViewer render a fabric-tinted swatch instead
 * of a broken `<img>` when it's unset. Once real photography exists, drop
 * files under `public/products/` and set `image: '/products/whatever.jpg'`
 * — nothing else needs to change.
 *
 * Price lives on each item, not the product — a product is a listing
 * (name, description, care info), items are what's actually for sale, each
 * with its own price. See types/index.ts for why.
 */
export const PRODUCTS: Product[] = [
  {
    id: 'kasavu-signature-saree',
    name: 'Kasavu Signature Saree',
    description:
      'Our signature weave — unbleached handspun cotton with a broad kasavu (zari) border, woven on a traditional pit loom by our senior weavers. The piece our studio is named for.',
    status: 'ACTIVE',
    displayOrder: 0,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'kasavu',
    specifications: [
      { label: 'Fabric', value: '100% handspun cotton, real zari border' },
      { label: 'Length', value: '5.5 m with attached blouse piece' },
      { label: 'Weave', value: 'Traditional pit loom, single weaver' },
      { label: 'Care', value: 'Dry clean recommended' },
    ],
    availability: 'Made to order — one piece at a time',
    delivery: 'Ships in 7–10 days, tracked courier across India',
    items: [
      { id: 'kasavu-signature-saree-1', image: '', price: 4999, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
      { id: 'kasavu-signature-saree-2', image: '', price: 5499, displayOrder: 1, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
  {
    id: 'handwoven-cotton-saree',
    name: 'Handwoven Cotton Saree',
    description:
      'A lighter, everyday weave in soft handloom cotton with a narrow contrast border — comfortable enough for a full day, still unmistakably handwoven.',
    status: 'ACTIVE',
    displayOrder: 1,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'cotton',
    specifications: [
      { label: 'Fabric', value: '100% handloom cotton' },
      { label: 'Length', value: '5.5 m with attached blouse piece' },
      { label: 'Weave', value: 'Traditional pit loom' },
      { label: 'Care', value: 'Hand wash cold, line dry in shade' },
    ],
    availability: 'In stock',
    delivery: 'Ships in 2–3 business days, tracked courier across India',
    items: [
      { id: 'handwoven-cotton-saree-1', image: '', price: 2499, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
      { id: 'handwoven-cotton-saree-2', image: '', price: 2699, displayOrder: 1, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
      { id: 'handwoven-cotton-saree-3', image: '', price: 2899, displayOrder: 2, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
  {
    id: 'pure-silk-saree',
    name: 'Pure Silk Saree',
    description:
      'A festive-weight pure silk saree with a woven gold-tone border, finished by hand. Substantial drape, made for weddings and temple visits alike.',
    status: 'ACTIVE',
    displayOrder: 2,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'silk',
    specifications: [
      { label: 'Fabric', value: '100% pure mulberry silk' },
      { label: 'Length', value: '5.5 m with attached blouse piece' },
      { label: 'Weave', value: 'Handloom, gold-tone zari border' },
      { label: 'Care', value: 'Dry clean only' },
    ],
    availability: 'Limited stock — festive collection',
    delivery: 'Ships in 5–7 days, tracked courier across India',
    items: [
      { id: 'pure-silk-saree-1', image: '', price: 8999, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
  {
    id: 'kerala-cotton-mundu',
    name: 'Kerala Cotton Mundu',
    description:
      'A traditional double mundu in unbleached cotton with a slim kasavu border — the everyday-to-festive staple, woven the way it has been for generations.',
    status: 'ACTIVE',
    displayOrder: 3,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'kasavu',
    specifications: [
      { label: 'Fabric', value: '100% handspun cotton, zari border' },
      { label: 'Size', value: 'Double mundu, one size' },
      { label: 'Weave', value: 'Traditional pit loom' },
      { label: 'Care', value: 'Hand wash cold, line dry in shade' },
    ],
    availability: 'In stock',
    delivery: 'Ships in 2–3 business days, tracked courier across India',
    items: [
      { id: 'kerala-cotton-mundu-1', image: '', price: 1299, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
      { id: 'kerala-cotton-mundu-2', image: '', price: 1499, displayOrder: 1, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
  {
    id: 'kasavu-stole',
    name: 'Kasavu Stole',
    description:
      'A narrow-loom kasavu stole in soft cotton — an easy way to carry the same handloom border as an everyday accessory, over a plain kurta or a saree.',
    status: 'ACTIVE',
    displayOrder: 4,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'kasavu',
    specifications: [
      { label: 'Fabric', value: '100% cotton, zari border on both ends' },
      { label: 'Size', value: '2 m × 0.75 m' },
      { label: 'Weave', value: 'Narrow-loom handweave' },
      { label: 'Care', value: 'Hand wash cold, line dry in shade' },
    ],
    availability: 'In stock',
    delivery: 'Ships in 2–3 business days, tracked courier across India',
    items: [
      { id: 'kasavu-stole-1', image: '', price: 999, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
      { id: 'kasavu-stole-2', image: '', price: 1099, displayOrder: 1, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
  {
    id: 'linen-blend-saree',
    name: 'Linen Blend Saree',
    description:
      'A cotton-linen blend woven for a crisper drape and a more contemporary palette, still finished with a hand-set border — for those who want handloom in a modern colourway.',
    status: 'ACTIVE',
    displayOrder: 5,
    createdAt: SEED_TIMESTAMP,
    updatedAt: SEED_TIMESTAMP,
    currency: 'INR',
    fabric: 'linen',
    specifications: [
      { label: 'Fabric', value: 'Cotton-linen blend' },
      { label: 'Length', value: '5.5 m with attached blouse piece' },
      { label: 'Weave', value: 'Handloom' },
      { label: 'Care', value: 'Dry clean recommended' },
    ],
    availability: 'In stock',
    delivery: 'Ships in 3–5 business days, tracked courier across India',
    items: [
      { id: 'linen-blend-saree-1', image: '', price: 3499, displayOrder: 0, status: 'ACTIVE', createdAt: SEED_TIMESTAMP, updatedAt: SEED_TIMESTAMP },
    ],
  },
];
