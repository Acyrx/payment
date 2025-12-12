-- Products table
CREATE TABLE IF NOT EXISTS products (
    variant_id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    price INT NOT NULL
);

-- Create index on product_id for faster queries
CREATE INDEX idx_products_product_id ON products(product_id);

-- Create indexes for users table
CREATE INDEX idx_users_customer_id ON profiles(customer_id);
CREATE INDEX idx_users_email ON profiles(email);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT UNIQUE NOT NULL REFERENCES profiles(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
    subscription_id INTEGER NOT NULL,
    product_id BIGINT NOT NULL,
    variant_id BIGINT NOT NULL REFERENCES products(variant_id) ON UPDATE CASCADE,
    status TEXT NOT NULL,
    cancelled BOOLEAN DEFAULT FALSE,
    renews_at TIMESTAMPTZ,
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for subscriptions table
CREATE INDEX idx_subscriptions_customer_id ON subscriptions(customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_renews_at ON subscriptions(renews_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at on subscriptions table
CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

-- Create RLS policies for users (users can only see their own data)
CREATE POLICY "Users can view own data"
    ON profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Create RLS policies for subscriptions (users can only see their own subscriptions)
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (
        customer_id IN (
            SELECT customer_id FROM profiles WHERE user_id = auth.uid()
        )
    );

