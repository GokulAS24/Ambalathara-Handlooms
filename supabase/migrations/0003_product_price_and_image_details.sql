-- Ambalathara Handlooms — product-level price + per-image details
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Safe to run against the live database: every new column is additive with a
-- backward-compatible default, existing rows are untouched (no delete, no
-- rewrite of existing data).
--
-- What changes:
--  - products gains its own `price` (the catalogue redesign now shows one
--    card per product with one price, rather than a bare price per image).
--    Existing products default to 0 — set a real price via the admin panel
--    after running this.
--  - product_items.price becomes NULLABLE: null means "use the product's
--    price", a set value means "this specific image is priced differently".
--    Existing items keep whatever price they already had (still a valid
--    override), nothing is nulled out automatically.
--  - product_items gains `description` (per-image caption, distinct from
--    the product's own description) and `is_primary` (which image is the
--    product's cover/thumbnail).

alter table products
  add column if not exists price numeric not null default 0 check (price >= 0);

alter table product_items
  alter column price drop not null,
  alter column price drop default;

alter table product_items
  add column if not exists description text not null default '',
  add column if not exists is_primary boolean not null default false;

-- At most one primary image per product, enforced by the database itself
-- rather than trusted to application code alone.
create unique index if not exists product_items_one_primary_per_product
  on product_items (product_id)
  where is_primary;

-- Every product that doesn't already have a primary image gets its
-- lowest-display-order active item promoted, so existing products render a
-- sensible cover image immediately after this migration runs (falls back to
-- any item if none are ACTIVE).
with ranked as (
  select
    id,
    product_id,
    row_number() over (
      partition by product_id
      order by (status = 'ACTIVE') desc, display_order asc
    ) as rnk
  from product_items
)
update product_items
set is_primary = true
from ranked
where product_items.id = ranked.id
  and ranked.rnk = 1
  and not exists (
    select 1 from product_items existing
    where existing.product_id = ranked.product_id and existing.is_primary
  );
