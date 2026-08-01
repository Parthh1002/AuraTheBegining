import { pool } from '../config/db';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

export async function initDatabaseAndSeed() {
  try {
    console.log('Connecting to PostgreSQL to initialize tables...');

    // Read and execute schema.sql
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schemaSql);
    console.log('PostgreSQL Database schema initialized successfully.');

    // 1. Seed Default Site Settings
    await pool.query(`INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);

    // 2. Seed Admin Account (admin@auramenswear.com / admin123)
    const adminEmail = 'admin@auramenswear.com';
    const existingAdmin = await pool.query('SELECT * FROM admins WHERE email = $1', [adminEmail]);

    if (existingAdmin.rows.length === 0) {
      const passwordHash = await bcrypt.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
        [adminEmail, passwordHash]
      );
      console.log('Default Admin Account created: admin@auramenswear.com / admin123');
    }

    // 3. Seed Initial Collections (Pure Men's Wear & Groom 20+)
    const colCount = await pool.query('SELECT COUNT(*) FROM collections');
    if (parseInt(colCount.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO collections (id, name, slug, description, cover_image_url, display_order, is_featured) VALUES
        ('c1000000-0000-0000-0000-000000000001', 'Royal Ethnic & Wedding', 'royal-ethnic', 'Handcrafted sherwanis, bandhgalas, and designer Indo-western ensembles for grooms and festive occasions (Men & Young Men 20+).', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 1, true),
        ('c1000000-0000-0000-0000-000000000002', 'Bespoke Suits & Tuxedos', 'bespoke-suits', 'Precision-cut double-breasted suits, tuxedo jackets, and sharp blazers in imported wools and velvets.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 2, true),
        ('c1000000-0000-0000-0000-000000000003', 'Kurtas & Festives', 'kurtas-festives', 'Pure silk, chanderi, and chikankari embroidered men kurtas paired with modern waistcoats for haldi, sangeet & celebrations.', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&auto=format&fit=crop', 3, true),
        ('c1000000-0000-0000-0000-000000000004', 'Casual Luxury & Linen', 'casual-luxury', 'Relaxed European flax linen shirts, tailored trousers, knitted polos, and light overshirts for refined leisure.', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 4, true);
      `);

      // Seed Initial Products
      await pool.query(`
        INSERT INTO products (id, name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku, display_order) VALUES
        ('p1000000-0000-0000-0000-000000000001', 'Obsidian Velvet Bandhgala', 'obsidian-velvet-bandhgala', 'c1000000-0000-0000-0000-000000000001', 'A rich midnight obsidian velvet bandhgala suit featuring handcrafted metallic gold buttons and sleek mandarin collar styling. Designed for evening receptions and celebratory galas.', 'Italian Silk Velvet & Gold Hardware', ARRAY['38','40','42','44'], 'Starting at ₹14,999', ARRAY['new-arrival','bestseller'], true, true, 'AURA-ETH-001', 1),
        ('p1000000-0000-0000-0000-000000000002', 'Imperial Gold Embroidered Sherwani', 'imperial-gold-sherwani', 'c1000000-0000-0000-0000-000000000001', 'Hand-stitched zari work on raw silk with intricate tonal embroidery along the chest and cuffs. Pairs with matching churidar and silk stole.', 'Raw Silk & Metallic Zari Thread', ARRAY['38','40','42','44','46'], 'Starting at ₹24,999', ARRAY['bestseller'], true, true, 'AURA-ETH-002', 2),
        ('p1000000-0000-0000-0000-000000000003', 'Midnight Noir Double-Breasted Suit', 'midnight-noir-db-suit', 'c1000000-0000-0000-0000-000000000002', 'Structured peak-lapel double-breasted suit tailored from pure Super 120s Italian wool. Finished with horn buttons and structured shoulder pads.', 'Super 120s Italian Wool', ARRAY['38','40','42','44'], 'Starting at ₹18,500', ARRAY['new-arrival'], true, true, 'AURA-SUT-001', 3),
        ('p1000000-0000-0000-0000-000000000004', 'Amber Glow Satin Tuxedo Jacket', 'amber-glow-satin-tuxedo', 'c1000000-0000-0000-0000-000000000002', 'Sharp modern tuxedo featuring amber satin shawl lapels over a deep matte void black jacket. Built for red-carpet moments.', 'Fine Wool Blend & Satin Lapel', ARRAY['38','40','42'], 'Starting at ₹16,999', ARRAY['new-arrival'], true, true, 'AURA-SUT-002', 4);
      `);

      // Seed Product Images
      await pool.query(`
        INSERT INTO product_images (product_id, storage_path, alt_text, display_order, is_primary) VALUES
        ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Obsidian Velvet Bandhgala front view', 1, true),
        ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'Imperial Gold Embroidered Sherwani', 1, true),
        ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 'Midnight Noir Double-Breasted Suit', 1, true),
        ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop', 'Amber Glow Satin Tuxedo Jacket', 1, true);
      `);

      // Seed Testimonials & Gallery
      await pool.query(`
        INSERT INTO testimonials (customer_name, rating, review_text) VALUES
        ('Vikramaditya Shah', 5, 'AURA in Dahegam is a hidden gem for groom clothing! Their velvet bandhgalas and custom fits are outstanding. Highly recommend for weddings!'),
        ('Rahul Patel', 5, 'Exceptional craftsmanship. Got a double-breasted tux made for my brother reception and received countless compliments. 5 stars on Google for a reason.');

        INSERT INTO gallery_items (storage_path, caption, instagram_url, display_order) VALUES
        ('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'The Heritage Groom Collection — AURA 2026', 'https://instagram.com', 1),
        ('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Midnight Obsidian Bandhgala with Gold Accents', 'https://instagram.com', 2);
      `);

      console.log('Initial Dahegam boutique products & categories seeded.');
    }
  } catch (err) {
    console.error('Database initialization warning:', err);
  }
}

if (require.main === module) {
  initDatabaseAndSeed().then(() => process.exit(0));
}
