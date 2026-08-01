-- ==========================================
-- AURA (The Beginning) — Seed Data
-- ==========================================

-- 1. Initial Collections
insert into collections (id, name, slug, description, cover_image_url, display_order, is_featured) values
  ('c1000000-0000-0000-0000-000000000001', 'Royal Ethnic & Wedding', 'royal-ethnic', 'Handcrafted sherwanis, bandhgalas, and designer Indo-western ensembles for groom and occasion wear.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Bespoke Suits & Tuxedos', 'bespoke-suits', 'Precision-cut double-breasted suits, tuxedo jackets, and sharp blazers in imported wools and velvets.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Casual Luxury & Linen', 'casual-luxury', 'Relaxed linen shirts, tailored trousers, knitted polos, and light overshirts for refined everyday leisure.', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 3, true),
  ('c1000000-0000-0000-0000-000000000004', 'Kurtas & Festives', 'kurtas-festives', 'Pure silk and cotton embroidered kurtas paired with modern waistcoats for festive gatherings.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 4, true)
on conflict (slug) do nothing;

-- 2. Initial Products
insert into products (id, name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku, display_order) values
  ('p1000000-0000-0000-0000-000000000001', 'Obsidian Velvet Bandhgala', 'obsidian-velvet-bandhgala', 'c1000000-0000-0000-0000-000000000001', 'A rich midnight obsidian velvet bandhgala suit featuring handcrafted metallic gold buttons and sleek mandarin collar styling. Designed for evening receptions and celebratory galas.', 'Italian Silk Velvet & Gold Hardware', ARRAY['38','40','42','44'], 'Starting at ₹14,999', ARRAY['new-arrival','bestseller'], true, true, 'AURA-ETH-001', 1),

  ('p1000000-0000-0000-0000-000000000002', 'Imperial Gold Embroidered Sherwani', 'imperial-gold-sherwani', 'c1000000-0000-0000-0000-000000000001', 'Hand-stitched zari work on raw silk with intricate tonal embroidery along the chest and cuffs. Pairs with matching churidar and silk stole.', 'Raw Silk & Metallic Zari Thread', ARRAY['38','40','42','44','46'], 'Starting at ₹24,999', ARRAY['bestseller'], true, true, 'AURA-ETH-002', 2),

  ('p1000000-0000-0000-0000-000000000003', 'Midnight Noir Double-Breasted Suit', 'midnight-noir-db-suit', 'c1000000-0000-0000-0000-000000000002', 'Structured peak-lapel double-breasted suit tailored from pure Super 120s Italian wool. Finished with horn buttons and structured shoulder pads.', 'Super 120s Italian Wool', ARRAY['38','40','42','44'], 'Starting at ₹18,500', ARRAY['new-arrival'], true, true, 'AURA-SUT-001', 3),

  ('p1000000-0000-0000-0000-000000000004', 'Amber Glow Satin Tuxedo Jacket', 'amber-glow-satin-tuxedo', 'c1000000-0000-0000-0000-000000000002', 'Sharp modern tuxedo featuring amber satin shawl lapels over a deep matte void black jacket. Built for red-carpet moments.', 'Fine Wool Blend & Satin Lapel', ARRAY['38','40','42'], 'Starting at ₹16,999', ARRAY['new-arrival'], true, true, 'AURA-SUT-002', 4),

  ('p1000000-0000-0000-0000-000000000005', 'Sand Linen Cuban Collar Shirt', 'sand-linen-cuban-shirt', 'c1000000-0000-0000-0000-000000000003', 'Breathable 100% French linen shirt in warm sand tone with a relaxed open collar and mother-of-pearl buttons.', '100% French Flax Linen', ARRAY['S','M','L','XL','XXL'], 'Starting at ₹3,499', ARRAY['new-arrival'], true, false, 'AURA-CAS-001', 5),

  ('p1000000-0000-0000-0000-000000000006', 'Emerald Silk Embroidered Kurta Set', 'emerald-silk-kurta-set', 'c1000000-0000-0000-0000-000000000004', 'Lustrous emerald green silk kurta with delicate thread work along the placket, paired with cream ivory trousers.', 'Pure Chanderi Silk Blend', ARRAY['38','40','42','44'], 'Starting at ₹7,999', ARRAY['bestseller'], true, true, 'AURA-KRT-001', 6)
on conflict (slug) do nothing;

-- 3. Initial Product Images
insert into product_images (product_id, storage_path, alt_text, display_order, is_primary) values
  ('p1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Obsidian Velvet Bandhgala front view', 1, true),
  ('p1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'Imperial Gold Embroidered Sherwani', 1, true),
  ('p1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 'Midnight Noir Double-Breasted Suit', 1, true),
  ('p1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop', 'Amber Glow Satin Tuxedo Jacket', 1, true),
  ('p1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop', 'Sand Linen Cuban Collar Shirt', 1, true),
  ('p1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 'Emerald Silk Embroidered Kurta Set', 1, true)
on conflict do nothing;

-- 4. Initial Testimonials
insert into testimonials (customer_name, rating, review_text) values
  ('Vikramaditya Shah', 5, 'AURA in Dahegam is a hidden gem for groom clothing! Their velvet bandhgalas and custom fits are outstanding. Highly recommend for weddings!'),
  ('Rahul Patel', 5, 'Exceptional craftsmanship. Got a double-breasted tux made for my brother reception and received countless compliments. 5 stars on Google for a reason.'),
  ('Devendra Sharma', 5, 'The fabric quality, stitching precision, and personal hospitality at the store are unmatched in GIDC Dahegam.'),
  ('Karan Mehta', 5, 'Superb casual linen shirts and bandi jackets. Prompt WhatsApp assistance whenever I want to check size availability.')
on conflict do nothing;

-- 5. Initial Gallery Items (Lookbook)
insert into gallery_items (storage_path, caption, instagram_url, display_order) values
  ('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'The Heritage Groom Collection — AURA 2026', 'https://instagram.com', 1),
  ('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Midnight Obsidian Bandhgala with Gold Accents', 'https://instagram.com', 2),
  ('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 'The Bespoke Tuxedo Series', 'https://instagram.com', 3),
  ('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 'Festive Chanderi Silk Ensembles', 'https://instagram.com', 4)
on conflict do nothing;
