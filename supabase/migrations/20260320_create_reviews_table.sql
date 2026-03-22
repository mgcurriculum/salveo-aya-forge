-- Create product_reviews table
create table if not exists public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text not null,
  customer_id text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review_text text not null,
  customer_name text,
  created_at timestamp with time zone default now(),
  -- Ensure one review per customer per product
  constraint product_reviews_product_customer_unique unique(product_id, customer_id)
);

-- Set table permissions
alter table public.product_reviews enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on public.product_reviews for select
  using (true);

-- Allow authenticated insert
-- Note: Verification is handled by the API proxy via Shopify Admin API
create policy "Allow internal insert"
  on public.product_reviews for insert
  with check (true);
