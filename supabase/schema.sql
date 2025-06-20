-- Products table
CREATE TABLE IF NOT EXISTS products (
    variant_id BIGINT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    price INT NOT NULL
);

-- Create index on product_id for faster queries
CREATE INDEX idx_products_product_id ON products(product_id);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_id TEXT UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for users table
CREATE INDEX idx_users_customer_id ON users(customer_id);
CREATE INDEX idx_users_email ON users(email);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT UNIQUE NOT NULL REFERENCES users(customer_id) ON UPDATE CASCADE ON DELETE CASCADE,
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

-- Create function to auto-populate users table when new auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email)
    VALUES (
        NEW.id,
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-populating users table
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products (public read access)
CREATE POLICY "Products are viewable by everyone"
    ON products FOR SELECT
    USING (true);

-- Create RLS policies for users (users can only see their own data)
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = user_id);

-- Create RLS policies for subscriptions (users can only see their own subscriptions)
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (
        customer_id IN (
            SELECT customer_id FROM users WHERE user_id = auth.uid()
        )
    );

