-- Create customers table
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  polar_customer_id text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  polar_product_id text unique not null,
  name text not null,
  description text,
  price_amount integer not null,
  price_currency text default 'usd',
  is_archived boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create subscriptions table
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  polar_subscription_id text unique not null,
  polar_product_id text not null,
  status text not null, -- active, canceled, revoked
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.customers enable row level security;
alter table public.products enable row level security;
alter table public.subscriptions enable row level security;

-- RLS Policies for customers
create policy "customers_select_all"
  on public.customers for select
  using (true);

create policy "customers_insert_service"
  on public.customers for insert
  with check (true);

create policy "customers_update_service"
  on public.customers for update
  using (true);

-- RLS Policies for products (public read)
create policy "products_select_all"
  on public.products for select
  using (true);

create policy "products_insert_service"
  on public.products for insert
  with check (true);

create policy "products_update_service"
  on public.products for update
  using (true);

-- RLS Policies for subscriptions
create policy "subscriptions_select_all"
  on public.subscriptions for select
  using (true);

create policy "subscriptions_insert_service"
  on public.subscriptions for insert
  with check (true);

create policy "subscriptions_update_service"
  on public.subscriptions for update
  using (true);

-- Indexes for better performance
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_polar_id on public.customers(polar_customer_id);
create index if not exists idx_subscriptions_customer on public.subscriptions(customer_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);




-- Add subscription status and token columns to customers table
alter table public.customers
add column if not exists subscription_status text default 'inactive',
add column if not exists tokens integer default 0;

-- Create an index for faster queries
create index if not exists idx_customers_subscription_status 
  on public.customers(subscription_status);

-- Add a comment to document the status values
comment on column public.customers.subscription_status is 
  'User subscription status: active, inactive, canceled, revoked';

comment on column public.customers.tokens is 
  'Number of tokens/credits available to the user';


- Add subscription status and token columns to customers table
alter table public.customers
add column if not exists subscription_status text default 'inactive',
add column if not exists tokens integer default 0;

-- Create an index for faster queries
create index if not exists idx_customers_subscription_status 
  on public.customers(subscription_status);

-- Add a comment to document the status values
comment on column public.customers.subscription_status is 
  'User subscription status: active, inactive, canceled, revoked';

comment on column public.customers.tokens is 
  'Number of tokens/credits available to the user';




-- Add support for free tier customers
-- When users sign up, they automatically get a free tier with 100 tokens

-- Update the customers table to add default values
ALTER TABLE customers 
ALTER COLUMN subscription_status SET DEFAULT 'free',
ALTER COLUMN tokens SET DEFAULT 100;

-- Add a comment to document the free tier
COMMENT ON COLUMN customers.subscription_status IS 'Subscription status: free, active, canceled, revoked';
COMMENT ON COLUMN customers.tokens IS 'Token count: 100 (free), 1000+ (paid tiers)';
