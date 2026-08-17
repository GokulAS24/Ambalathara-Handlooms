-- Ambalathara Handlooms — initial schema
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- Two tables, matching the app's existing Product / ProductItem shape
-- (see types/index.ts): a product is a listing (name, description, care
-- info), items are the actually-priced, actually-photographed things for
-- sale under it. Price lives on the item, never the product.

create extension if not exists pgcrypto;

create table if not exists products (
  id text primary key,
  name text not null,
  description text not null default '',
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  display_order integer not null default 0,
  fabric text not null check (fabric in ('cotton', 'silk', 'kasavu', 'linen')),
  specifications jsonb not null default '[]'::jsonb,
  availability text not null default '',
  delivery text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists product_items (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  image text not null default '',
  price numeric not null default 0 check (price >= 0),
  display_order integer not null default 0,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists product_items_product_id_idx on product_items (product_id);

-- Keep updated_at honest without relying on every call site to set it.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

drop trigger if exists product_items_set_updated_at on product_items;
create trigger product_items_set_updated_at
before update on product_items
for each row execute function set_updated_at();

-- ── Row Level Security ──────────────────────────────────────────────
-- Public (anon key, the customer site): can only read ACTIVE rows, and
-- only items whose parent product is also ACTIVE (checked directly here,
-- not left to the app, so a direct API call can't leak an archived
-- product's items). Any signed-in user (authenticated role) can read and
-- write everything — see the admin login note below for what that means
-- in practice for this project.

alter table products enable row level security;
alter table product_items enable row level security;

create policy "Public reads active products, admin reads all"
on products for select
using (
  status = 'ACTIVE'
  or (select auth.role()) = 'authenticated'
);

create policy "Public reads active items of active products, admin reads all"
on product_items for select
using (
  (select auth.role()) = 'authenticated'
  or (
    status = 'ACTIVE'
    and exists (
      select 1 from products p
      where p.id = product_items.product_id and p.status = 'ACTIVE'
    )
  )
);

create policy "Admin writes products"
on products for insert to authenticated with check (true);

create policy "Admin updates products"
on products for update to authenticated using (true) with check (true);

create policy "Admin deletes products"
on products for delete to authenticated using (true);

create policy "Admin writes product items"
on product_items for insert to authenticated with check (true);

create policy "Admin updates product items"
on product_items for update to authenticated using (true) with check (true);

create policy "Admin deletes product items"
on product_items for delete to authenticated using (true);

-- ── Storage: product-images bucket ──────────────────────────────────
-- Public bucket (product photos are meant to be publicly visible) —
-- reads are open, writes require a signed-in session.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public reads product images"
on storage.objects for select
using (bucket_id = 'product-images');

create policy "Admin uploads product images"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images');

create policy "Admin updates product images"
on storage.objects for update to authenticated
using (bucket_id = 'product-images');

create policy "Admin deletes product images"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images');
