-- ############################################################
-- # MyTopPharma Database Schema
-- # Version: 1.0
-- # Date: 2025-03-17
-- ############################################################

-- ############################################################
-- # EXTENSIONS AND CONFIGURATIONS
-- ############################################################

-- Enable UUID extension for UUID primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ############################################################
-- # UTILITY FUNCTIONS
-- ############################################################

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ############################################################
-- # CORE TABLES
-- ############################################################

-- Companies Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    header_image_url TEXT,
    headquarters VARCHAR(255),
    founded VARCHAR(10),
    website VARCHAR(255),
    market_cap DECIMAL(15,2),
    employees INTEGER,
    stock_symbol VARCHAR(20),
    stock_exchange VARCHAR(50),
    ownership_type VARCHAR(50),
    parent_company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug VARCHAR(255) UNIQUE
);

-- Therapeutic Areas Table
CREATE TABLE therapeutic_areas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug VARCHAR(255) UNIQUE
);

-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    description TEXT,
    stage VARCHAR(50),
    molecule_type VARCHAR(100),
    image_url TEXT,
    website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    slug VARCHAR(255) UNIQUE
);

-- Website Categories Table
CREATE TABLE website_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Websites Table
CREATE TABLE websites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) NOT NULL,
    site_name VARCHAR(255),
    category_id UUID REFERENCES website_categories(id),
    description TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    region VARCHAR(100),
    language VARCHAR(50),
    url VARCHAR(255) NOT NULL,
    has_ssl BOOLEAN DEFAULT false,
    screenshot_url TEXT,
    screenshot_date TIMESTAMP WITH TIME ZONE,
    last_crawl TIMESTAMP WITH TIME ZONE,
    last_updated TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regions Table
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indications Table
CREATE TABLE indications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    job_title VARCHAR(255),
    company VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- ############################################################
-- # RELATIONSHIP TABLES
-- ############################################################

-- Company Therapeutic Areas (Many-to-Many)
CREATE TABLE company_therapeutic_areas (
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    therapeutic_area_id UUID REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (company_id, therapeutic_area_id)
);

-- Product Therapeutic Areas (Many-to-Many)
CREATE TABLE product_therapeutic_areas (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    therapeutic_area_id UUID REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (product_id, therapeutic_area_id)
);

-- Product Indications (Many-to-Many)
CREATE TABLE product_indications (
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    indication_id UUID REFERENCES indications(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (product_id, indication_id)
);

-- Website Therapeutic Areas (Many-to-Many)
CREATE TABLE website_therapeutic_areas (
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    therapeutic_area_id UUID REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (website_id, therapeutic_area_id)
);

-- ############################################################
-- # DETAIL TABLES
-- ############################################################

-- Company Financials Table
CREATE TABLE company_financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    revenue DECIMAL(15,2),
    r_and_d_spending DECIMAL(15,2),
    net_income DECIMAL(15,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, year)
);

-- Company Milestones Table
CREATE TABLE company_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    date DATE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    milestone_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Related Companies Table
CREATE TABLE related_companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    related_company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    relationship_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT diff_companies CHECK (company_id != related_company_id)
);

-- Product Timeline Table
CREATE TABLE product_timelines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    date DATE,
    stage VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Approvals Table
CREATE TABLE product_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    region VARCHAR(100),
    date DATE,
    agency VARCHAR(100),
    status VARCHAR(100),
    indication VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Patents Table
CREATE TABLE product_patents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    number VARCHAR(100),
    expiry_date DATE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Tech Stack Table
CREATE TABLE website_tech_stack (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    cms VARCHAR(100),
    framework VARCHAR(100),
    server VARCHAR(100),
    analytics VARCHAR(100),
    email_service VARCHAR(100),
    marketing_automation VARCHAR(100),
    cdn_provider VARCHAR(100),
    search_technology VARCHAR(100),
    chat_provider VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Hosting Table
CREATE TABLE website_hosting (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    provider VARCHAR(100),
    ip VARCHAR(100),
    registrar VARCHAR(100),
    registration_date DATE,
    expiration_date DATE,
    nameservers TEXT,
    ssl_provider VARCHAR(100),
    ssl_expiration_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Legal Content Table
CREATE TABLE website_legal_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    content_type VARCHAR(100), -- e.g., "Privacy Policy", "Terms of Use"
    text TEXT,
    url VARCHAR(255),
    last_updated DATE,
    jurisdiction VARCHAR(100),
    version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Website Features Table
CREATE TABLE website_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    name VARCHAR(100),
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(50),
    added_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert Subscriptions Table
CREATE TABLE alert_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type_of_alert VARCHAR(100),
    reference_id UUID,
    frequency VARCHAR(50),
    last_sent TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory Approvals Table
CREATE TABLE regulatory_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    agency VARCHAR(100),
    approval_date DATE,
    indication VARCHAR(255),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Preferences Table
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    preference_key VARCHAR(100),
    preference_value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, preference_key)
);

-- User Followed Companies Table
CREATE TABLE user_followed_companies (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, company_id)
);

-- User Followed Products Table
CREATE TABLE user_followed_products (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, product_id)
);

-- User Followed Therapeutic Areas Table
CREATE TABLE user_followed_therapeutic_areas (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    therapeutic_area_id UUID REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, therapeutic_area_id)
);

-- User Followed Websites Table
CREATE TABLE user_followed_websites (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, website_id)
);

-- User Notifications Table
CREATE TABLE user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100),
    title VARCHAR(255),
    message TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT false,
    action_url VARCHAR(255),
    entity_id UUID,
    entity_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News/Press Release Table
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(255),
    url VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    date DATE,
    content TEXT,
    sentiment VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Company Relationships
CREATE TABLE news_companies (
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (news_id, company_id)
);

-- News Product Relationships
CREATE TABLE news_products (
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (news_id, product_id)
);

-- News Therapeutic Area Relationships
CREATE TABLE news_therapeutic_areas (
    news_id UUID REFERENCES news(id) ON DELETE CASCADE,
    therapeutic_area_id UUID REFERENCES therapeutic_areas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (news_id, therapeutic_area_id)
);

-- ############################################################
-- # INDEXES
-- ############################################################

-- Company Indexes
CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_stock_symbol ON companies(stock_symbol);
CREATE INDEX idx_companies_headquarters ON companies(headquarters);

-- Product Indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_company_id ON products(company_id);
CREATE INDEX idx_products_stage ON products(stage);

-- Therapeutic Area Indexes
CREATE INDEX idx_therapeutic_areas_name ON therapeutic_areas(name);
CREATE INDEX idx_therapeutic_areas_slug ON therapeutic_areas(slug);

-- Website Indexes
CREATE INDEX idx_websites_domain ON websites(domain);
CREATE INDEX idx_websites_company_id ON websites(company_id);
CREATE INDEX idx_websites_status ON websites(status);

-- Relationship Indexes
CREATE INDEX idx_company_ta_company_id ON company_therapeutic_areas(company_id);
CREATE INDEX idx_company_ta_therapeutic_area_id ON company_therapeutic_areas(therapeutic_area_id);

CREATE INDEX idx_product_ta_product_id ON product_therapeutic_areas(product_id);
CREATE INDEX idx_product_ta_therapeutic_area_id ON product_therapeutic_areas(therapeutic_area_id);

CREATE INDEX idx_product_ind_product_id ON product_indications(product_id);
CREATE INDEX idx_product_ind_indication_id ON product_indications(indication_id);

-- Detail Table Indexes
CREATE INDEX idx_company_financials_company_id ON company_financials(company_id);
CREATE INDEX idx_company_milestones_company_id ON company_milestones(company_id);
CREATE INDEX idx_product_timelines_product_id ON product_timelines(product_id);
CREATE INDEX idx_product_approvals_product_id ON product_approvals(product_id);
CREATE INDEX idx_product_patents_product_id ON product_patents(product_id);

-- User Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- News Indexes
CREATE INDEX idx_news_date ON news(date);
CREATE INDEX idx_news_title ON news(title);

-- ############################################################
-- # TRIGGERS
-- ############################################################

-- Trigger for companies table
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for therapeutic_areas table
CREATE TRIGGER update_therapeutic_areas_updated_at
BEFORE UPDATE ON therapeutic_areas
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for websites table
CREATE TRIGGER update_websites_updated_at
BEFORE UPDATE ON websites
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for website_categories table
CREATE TRIGGER update_website_categories_updated_at
BEFORE UPDATE ON website_categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for company_financials table
CREATE TRIGGER update_company_financials_updated_at
BEFORE UPDATE ON company_financials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for company_milestones table
CREATE TRIGGER update_company_milestones_updated_at
BEFORE UPDATE ON company_milestones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_timelines table
CREATE TRIGGER update_product_timelines_updated_at
BEFORE UPDATE ON product_timelines
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_approvals table
CREATE TRIGGER update_product_approvals_updated_at
BEFORE UPDATE ON product_approvals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for product_patents table
CREATE TRIGGER update_product_patents_updated_at
BEFORE UPDATE ON product_patents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences table
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_notifications table
CREATE TRIGGER update_user_notifications_updated_at
BEFORE UPDATE ON user_notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger for news table
CREATE TRIGGER update_news_updated_at
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ############################################################
-- # ROW LEVEL SECURITY POLICIES
-- ############################################################

-- Enable RLS on tables that need it
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapeutic_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followed_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followed_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followed_therapeutic_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followed_websites ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access to companies" 
ON companies FOR SELECT USING (true);

CREATE POLICY "Allow public read access to products" 
ON products FOR SELECT USING (true);

CREATE POLICY "Allow public read access to therapeutic_areas" 
ON therapeutic_areas FOR SELECT USING (true);

CREATE POLICY "Allow public read access to websites" 
ON websites FOR SELECT USING (true);

-- Authenticated user write access policies
CREATE POLICY "Allow authenticated users to insert companies" 
ON companies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update companies" 
ON companies FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert products" 
ON products FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- User-specific policies
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own preferences" 
ON user_preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON user_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
ON user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notifications" 
ON user_notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON user_notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Following policies
CREATE POLICY "Users can view their followed companies" 
ON user_followed_companies FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can follow/unfollow companies" 
ON user_followed_companies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their followed companies" 
ON user_followed_companies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their followed products" 
ON user_followed_products FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can follow/unfollow products" 
ON user_followed_products FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their followed products" 
ON user_followed_products FOR DELETE USING (auth.uid() = user_id);
