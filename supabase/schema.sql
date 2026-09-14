-- DZD Store secure commerce schema
-- Run this in the Supabase SQL editor.

create table if not exists public.products (
  id bigint primary key,
  name text not null,
  description text not null,
  price_dzd integer not null check (price_dzd > 0),
  category text not null,
  icon text default '📦',
  file_key text,
  file_name text,
  download_limit integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text unique not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  payment_method text,
  payment_reference text,
  status text not null default 'PENDING' check (status in ('PENDING','PAID','FAILED','CANCELLED','REFUNDED')),
  total_dzd integer not null check (total_dzd >= 0),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id),
  product_name text not null,
  price_dzd integer not null,
  file_key text,
  file_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.download_tokens (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id bigint not null references public.products(id),
  token_hash text unique not null,
  downloads integer not null default 0,
  max_downloads integer not null default 5,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now(),
  last_download_at timestamptz
);

create index if not exists idx_orders_code on public.orders(order_code);
create index if not exists idx_orders_email on public.orders(customer_email);
create index if not exists idx_download_tokens_hash on public.download_tokens(token_hash);

-- RLS: the browser must not be able to read or modify paid-order data directly.
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.download_tokens enable row level security;

-- Product catalog can be exposed only through a future controlled API or a separate public view.
-- No direct policies are created for orders/items/download tokens.

-- Private storage bucket. Create it from the Storage UI or SQL if your project permits:
-- insert into storage.buckets (id, name, public) values ('products-private', 'products-private', false)
-- on conflict (id) do nothing;

-- IMPORTANT: never store service/secret keys in this repository or in browser JavaScript.
