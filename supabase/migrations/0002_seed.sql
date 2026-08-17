-- Ambalathara Handlooms — starter catalog
-- Run after 0001_init.sql. Seeds the same 6 products this site launched
-- with (previously lib/products.ts's hardcoded array) so the catalog
-- isn't empty the moment Supabase becomes the source of truth. Safe to
-- re-run — `on conflict do nothing` skips rows that already exist.

insert into products (id, name, description, status, display_order, fabric, specifications, availability, delivery)
values
  (
    'kasavu-signature-saree',
    'Kasavu Signature Saree',
    'Our signature weave — unbleached handspun cotton with a broad kasavu (zari) border, woven on a traditional pit loom by our senior weavers. The piece our studio is named for.',
    'ACTIVE', 0, 'kasavu',
    '[{"label":"Fabric","value":"100% handspun cotton, real zari border"},{"label":"Length","value":"5.5 m with attached blouse piece"},{"label":"Weave","value":"Traditional pit loom, single weaver"},{"label":"Care","value":"Dry clean recommended"}]'::jsonb,
    'Made to order — one piece at a time',
    'Ships in 7–10 days, tracked courier across India'
  ),
  (
    'handwoven-cotton-saree',
    'Handwoven Cotton Saree',
    'A lighter, everyday weave in soft handloom cotton with a narrow contrast border — comfortable enough for a full day, still unmistakably handwoven.',
    'ACTIVE', 1, 'cotton',
    '[{"label":"Fabric","value":"100% handloom cotton"},{"label":"Length","value":"5.5 m with attached blouse piece"},{"label":"Weave","value":"Traditional pit loom"},{"label":"Care","value":"Hand wash cold, line dry in shade"}]'::jsonb,
    'In stock',
    'Ships in 2–3 business days, tracked courier across India'
  ),
  (
    'pure-silk-saree',
    'Pure Silk Saree',
    'A festive-weight pure silk saree with a woven gold-tone border, finished by hand. Substantial drape, made for weddings and temple visits alike.',
    'ACTIVE', 2, 'silk',
    '[{"label":"Fabric","value":"100% pure mulberry silk"},{"label":"Length","value":"5.5 m with attached blouse piece"},{"label":"Weave","value":"Handloom, gold-tone zari border"},{"label":"Care","value":"Dry clean only"}]'::jsonb,
    'Limited stock — festive collection',
    'Ships in 5–7 days, tracked courier across India'
  ),
  (
    'kerala-cotton-mundu',
    'Kerala Cotton Mundu',
    'A traditional double mundu in unbleached cotton with a slim kasavu border — the everyday-to-festive staple, woven the way it has been for generations.',
    'ACTIVE', 3, 'kasavu',
    '[{"label":"Fabric","value":"100% handspun cotton, zari border"},{"label":"Size","value":"Double mundu, one size"},{"label":"Weave","value":"Traditional pit loom"},{"label":"Care","value":"Hand wash cold, line dry in shade"}]'::jsonb,
    'In stock',
    'Ships in 2–3 business days, tracked courier across India'
  ),
  (
    'kasavu-stole',
    'Kasavu Stole',
    'A narrow-loom kasavu stole in soft cotton — an easy way to carry the same handloom border as an everyday accessory, over a plain kurta or a saree.',
    'ACTIVE', 4, 'kasavu',
    '[{"label":"Fabric","value":"100% cotton, zari border on both ends"},{"label":"Size","value":"2 m × 0.75 m"},{"label":"Weave","value":"Narrow-loom handweave"},{"label":"Care","value":"Hand wash cold, line dry in shade"}]'::jsonb,
    'In stock',
    'Ships in 2–3 business days, tracked courier across India'
  ),
  (
    'linen-blend-saree',
    'Linen Blend Saree',
    'A cotton-linen blend woven for a crisper drape and a more contemporary palette, still finished with a hand-set border — for those who want handloom in a modern colourway.',
    'ACTIVE', 5, 'linen',
    '[{"label":"Fabric","value":"Cotton-linen blend"},{"label":"Length","value":"5.5 m with attached blouse piece"},{"label":"Weave","value":"Handloom"},{"label":"Care","value":"Dry clean recommended"}]'::jsonb,
    'In stock',
    'Ships in 3–5 business days, tracked courier across India'
  )
on conflict (id) do nothing;

insert into product_items (id, product_id, image, price, display_order, status)
values
  ('kasavu-signature-saree-1', 'kasavu-signature-saree', '', 4999, 0, 'ACTIVE'),
  ('kasavu-signature-saree-2', 'kasavu-signature-saree', '', 5499, 1, 'ACTIVE'),
  ('handwoven-cotton-saree-1', 'handwoven-cotton-saree', '', 2499, 0, 'ACTIVE'),
  ('handwoven-cotton-saree-2', 'handwoven-cotton-saree', '', 2699, 1, 'ACTIVE'),
  ('handwoven-cotton-saree-3', 'handwoven-cotton-saree', '', 2899, 2, 'ACTIVE'),
  ('pure-silk-saree-1', 'pure-silk-saree', '', 8999, 0, 'ACTIVE'),
  ('kerala-cotton-mundu-1', 'kerala-cotton-mundu', '', 1299, 0, 'ACTIVE'),
  ('kerala-cotton-mundu-2', 'kerala-cotton-mundu', '', 1499, 1, 'ACTIVE'),
  ('kasavu-stole-1', 'kasavu-stole', '', 999, 0, 'ACTIVE'),
  ('kasavu-stole-2', 'kasavu-stole', '', 1099, 1, 'ACTIVE'),
  ('linen-blend-saree-1', 'linen-blend-saree', '', 3499, 0, 'ACTIVE')
on conflict (id) do nothing;
