-- ==========================================
-- AURA (The Beginning) — PostgreSQL Native Database Schema
-- ==========================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admins Table (For CMS Authentication)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Collections Table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  display_order INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  description TEXT,
  fabric TEXT,
  sizes TEXT[] DEFAULT '{}',
  price_label TEXT,
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  sku TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  display_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,     -- 'contact_form' | 'whatsapp_product' | 'newsletter' | 'stock_notify'
  name TEXT,
  phone TEXT,
  email TEXT,
  message TEXT,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new', -- 'new' | 'contacted' | 'closed'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gallery Items Table (Lookbook)
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path TEXT NOT NULL,
  caption TEXT,
  instagram_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  review_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Subscribers Table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Site Settings Table (Single Row)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  store_phone TEXT DEFAULT '+91 98765 43210',
  whatsapp_number TEXT DEFAULT '919876543210',
  store_address TEXT DEFAULT 'Shop no 2, plot, AURA (The Beginning), Sri Ram Tiles Industries Compound, opposite Balmukund Prime, GIDC, Dahegam, Gujarat 382305',
  store_hours JSONB DEFAULT '{
    "monday": {"open": "10:00 AM", "close": "09:00 PM", "closed": false},
    "tuesday": {"open": "10:00 AM", "close": "09:00 PM", "closed": false},
    "wednesday": {"open": "10:00 AM", "close": "09:00 PM", "closed": false},
    "thursday": {"open": "10:00 AM", "close": "09:00 PM", "closed": false},
    "friday": {"open": "10:00 AM", "close": "09:00 PM", "closed": false},
    "saturday": {"open": "10:00 AM", "close": "09:30 PM", "closed": false},
    "sunday": {"open": "10:30 AM", "close": "09:00 PM", "closed": false}
  }'::jsonb,
  instagram_url TEXT DEFAULT 'https://instagram.com',
  hero_headline TEXT DEFAULT 'Elegance Emerges from Darkness',
  hero_subtext TEXT DEFAULT 'Discover bespoke tailoring, premium linen suits, and modern ethnic wear designed for the modern gentleman.',
  hero_media_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
