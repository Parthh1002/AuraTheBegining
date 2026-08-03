-- ==========================================
-- AURA (The Beginning) — Seed Data (Expanded Demo)
-- ==========================================

-- 1. Collections
insert into collections (id, name, slug, description, cover_image_url, display_order, is_featured) values
  ('c011ec71-0000-0000-0000-000000000001', 'Royal Ethnic & Wedding', 'royal-ethnic', 'Handcrafted sherwanis, bandhgalas, and designer Indo-western ensembles for groom and occasion wear.', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 1, true),
  ('c011ec71-0000-0000-0000-000000000002', 'Bespoke Suits & Tuxedos', 'bespoke-suits', 'Precision-cut double-breasted suits, tuxedo jackets, and sharp blazers in imported wools and velvets.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 2, true),
  ('c011ec71-0000-0000-0000-000000000003', 'Casual Luxury & Linen', 'casual-luxury', 'Relaxed linen shirts, tailored trousers, knitted polos, and light overshirts for refined everyday leisure.', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 3, true),
  ('c011ec71-0000-0000-0000-000000000004', 'Kurtas & Festives', 'kurtas-festives', 'Pure silk and cotton embroidered kurtas paired with modern waistcoats for festive gatherings.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 4, true),
  ('c011ec71-0000-0000-0000-000000000005', 'Winter & Layering', 'winter-layering', 'Premium trench coats, cashmere overcoats, and wool-blend jackets for sophisticated winter styling.', 'https://images.unsplash.com/photo-1512411986422-9214d0263f69?q=80&w=1200&auto=format&fit=crop', 5, true)
on conflict (slug) do nothing;

-- 2. Products
insert into products (id, name, slug, collection_id, description, fabric, sizes, price_label, tags, in_stock, is_featured, sku, display_order) values
  ('b80d0c75-0000-0000-0000-000000000001', 'Obsidian Velvet Bandhgala', 'obsidian-velvet-bandhgala', 'c011ec71-0000-0000-0000-000000000001', 'A rich midnight obsidian velvet bandhgala suit featuring handcrafted metallic gold buttons and sleek mandarin collar styling. Designed for evening receptions and celebratory galas.', 'Italian Silk Velvet', ARRAY['38','40','42','44'], 'Starting at ₹14,999', ARRAY['new-arrival','bestseller'], true, true, 'AURA-ETH-001', 1),
  ('b80d0c75-0000-0000-0000-000000000002', 'Imperial Gold Embroidered Sherwani', 'imperial-gold-sherwani', 'c011ec71-0000-0000-0000-000000000001', 'Hand-stitched zari work on raw silk with intricate tonal embroidery along the chest and cuffs. Pairs with matching churidar and silk stole.', 'Raw Silk & Zari', ARRAY['38','40','42','44','46'], 'Starting at ₹24,999', ARRAY['bestseller'], true, true, 'AURA-ETH-002', 2),
  ('b80d0c75-0000-0000-0000-000000000003', 'Midnight Noir Double-Breasted Suit', 'midnight-noir-db-suit', 'c011ec71-0000-0000-0000-000000000002', 'Structured peak-lapel double-breasted suit tailored from pure Super 120s Italian wool. Finished with horn buttons and structured shoulder pads.', 'Super 120s Wool', ARRAY['38','40','42','44'], 'Starting at ₹18,500', ARRAY['new-arrival'], true, true, 'AURA-SUT-001', 3),
  ('b80d0c75-0000-0000-0000-000000000004', 'Amber Glow Satin Tuxedo Jacket', 'amber-glow-satin-tuxedo', 'c011ec71-0000-0000-0000-000000000002', 'Sharp modern tuxedo featuring amber satin shawl lapels over a deep matte void black jacket. Built for red-carpet moments.', 'Fine Wool Blend', ARRAY['38','40','42'], 'Starting at ₹16,999', ARRAY['new-arrival'], true, true, 'AURA-SUT-002', 4),
  ('b80d0c75-0000-0000-0000-000000000005', 'Sand Linen Cuban Collar Shirt', 'sand-linen-cuban-shirt', 'c011ec71-0000-0000-0000-000000000003', 'Breathable 100% French linen shirt in warm sand tone with a relaxed open collar and mother-of-pearl buttons.', 'French Flax Linen', ARRAY['S','M','L','XL','XXL'], 'Starting at ₹3,499', ARRAY['summer-edit'], true, false, 'AURA-CAS-001', 5),
  ('b80d0c75-0000-0000-0000-000000000006', 'Emerald Silk Embroidered Kurta Set', 'emerald-silk-kurta-set', 'c011ec71-0000-0000-0000-000000000004', 'Lustrous emerald green silk kurta with delicate thread work along the placket, paired with cream ivory trousers.', 'Pure Chanderi Silk', ARRAY['38','40','42','44'], 'Starting at ₹7,999', ARRAY['bestseller'], true, true, 'AURA-KRT-001', 6),
  ('b80d0c75-0000-0000-0000-000000000007', 'Classic Charcoal Grey Three-Piece Suit', 'charcoal-grey-3piece', 'c011ec71-0000-0000-0000-000000000002', 'The quintessential corporate and wedding three-piece suit. Comes with a matching five-button waistcoat.', 'Premium Wool Blend', ARRAY['38','40','42','44','46'], 'Starting at ₹21,000', ARRAY['classic'], true, true, 'AURA-SUT-003', 7),
  ('b80d0c75-0000-0000-0000-000000000008', 'Ivory Floral Jacquard Nehru Jacket', 'ivory-floral-nehru', 'c011ec71-0000-0000-0000-000000000004', 'Elegant ivory Nehru jacket woven with subtle silver and gold floral motifs. Perfect for haldi or mehendi ceremonies.', 'Jacquard Silk', ARRAY['38','40','42'], 'Starting at ₹6,500', ARRAY['festive'], true, true, 'AURA-KRT-002', 8),
  ('b80d0c75-0000-0000-0000-000000000009', 'Navy Blue Cashmere Overcoat', 'navy-cashmere-overcoat', 'c011ec71-0000-0000-0000-000000000005', 'Luxuriously soft, tailored overcoat crafted from premium cashmere. Features deep pockets and a strong collar.', 'Cashmere & Wool', ARRAY['M','L','XL'], 'Starting at ₹28,999', ARRAY['premium'], true, true, 'AURA-WNT-001', 9),
  ('b80d0c75-0000-0000-0000-000000000010', 'Olive Knitted Zip-Up Polo', 'olive-knitted-polo', 'c011ec71-0000-0000-0000-000000000003', 'Modern zip-up polo shirt in a rich olive green. Highly breathable with a gentle stretch for all-day comfort.', 'Cotton Blend Knit', ARRAY['S','M','L','XL'], 'Starting at ₹2,800', ARRAY['casual'], true, false, 'AURA-CAS-002', 10)
on conflict (slug) do nothing;

-- 3. Product Images
insert into product_images (product_id, storage_path, alt_text, display_order, is_primary) values
  ('b80d0c75-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Obsidian Velvet Bandhgala', 1, true),
  ('b80d0c75-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'Imperial Gold Sherwani', 1, true),
  ('b80d0c75-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 'Midnight Noir Suit', 1, true),
  ('b80d0c75-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop', 'Amber Glow Tuxedo', 1, true),
  ('b80d0c75-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop', 'Sand Linen Shirt', 1, true),
  ('b80d0c75-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 'Emerald Silk Kurta', 1, true),
  ('b80d0c75-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1589317621382-0cbefeac0b3b?q=80&w=1200&auto=format&fit=crop', 'Charcoal Grey 3-Piece', 1, true),
  ('b80d0c75-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1599304918290-7603c40787a7?q=80&w=1200&auto=format&fit=crop', 'Ivory Nehru Jacket', 1, true),
  ('b80d0c75-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1200&auto=format&fit=crop', 'Navy Cashmere Overcoat', 1, true),
  ('b80d0c75-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop', 'Olive Knitted Polo', 1, true)
on conflict do nothing;

-- 4. Testimonials (10 Items)
insert into testimonials (customer_name, rating, review_text) values
  ('Vikramaditya Shah', 5, 'AURA in Dahegam is a hidden gem for groom clothing! Their velvet bandhgalas and custom fits are outstanding. Highly recommend for weddings!'),
  ('Rahul Patel', 5, 'Exceptional craftsmanship. Got a double-breasted tux made for my brother reception and received countless compliments. 5 stars on Google for a reason.'),
  ('Devendra Sharma', 5, 'The fabric quality, stitching precision, and personal hospitality at the store are unmatched in GIDC Dahegam.'),
  ('Karan Mehta', 5, 'Superb casual linen shirts and bandi jackets. Prompt WhatsApp assistance whenever I want to check size availability.'),
  ('Arjun Desai', 5, 'Bought the Imperial Gold Sherwani for my big day. The fit was flawless and it looked extremely premium. The team at AURA really knows luxury.'),
  ('Rohan Khatri', 4, 'Very good collection of winter wear. The cashmere coat I purchased is incredibly warm and sharp-looking. Worth the investment.'),
  ('Manish Verma', 5, 'Best bespoke tailors in Gujarat. I’ve stopped buying ready-made suits entirely. AURA gives me the perfect custom fit every single time.'),
  ('Suraj Singh', 5, 'Wore their linen cuban shirt on my vacation to Bali. So comfortable, breathable, and stylish! Will buy more colors soon.'),
  ('Aditya Joshi', 5, 'The store ambiance and the trial experience are pure luxury. They patiently worked with me to finalize my 3-piece wedding suit.'),
  ('Nitin Bhatia', 4, 'Great fabric choices. The delivery took a bit longer than expected during peak season, but the final product was absolutely worth the wait.')
on conflict do nothing;

-- 5. Gallery Items (Lookbook - 10 Items)
insert into gallery_items (storage_path, caption, instagram_url, display_order) values
  ('https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop', 'The Heritage Groom Collection — AURA 2026', 'https://instagram.com', 1),
  ('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop', 'Midnight Obsidian Bandhgala with Gold Accents', 'https://instagram.com', 2),
  ('https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200&auto=format&fit=crop', 'The Bespoke Tuxedo Series', 'https://instagram.com', 3),
  ('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop', 'Festive Chanderi Silk Ensembles', 'https://instagram.com', 4),
  ('https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=1200&auto=format&fit=crop', 'Amber Glow Satin Evening Look', 'https://instagram.com', 5),
  ('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1200&auto=format&fit=crop', 'Linen Resort Wear Collection', 'https://instagram.com', 6),
  ('https://images.unsplash.com/photo-1589317621382-0cbefeac0b3b?q=80&w=1200&auto=format&fit=crop', 'Corporate Power Dressing', 'https://instagram.com', 7),
  ('https://images.unsplash.com/photo-1599304918290-7603c40787a7?q=80&w=1200&auto=format&fit=crop', 'Modern Nehru Jackets', 'https://instagram.com', 8),
  ('https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1200&auto=format&fit=crop', 'Winter Overcoats Edit', 'https://instagram.com', 9),
  ('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1200&auto=format&fit=crop', 'Casual Knits and Polos', 'https://instagram.com', 10)
on conflict do nothing;
