import { Router } from 'express';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/settings
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM site_settings WHERE id = 1');
    if (rows.length === 0) {
      return res.json(memoryStore.settings);
    }
    return res.json(rows[0]);
  } catch (err: any) {
    // Fallback to memoryStore
    return res.json(memoryStore.settings);
  }
});

// PUT /api/settings (Admin)
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { store_phone, whatsapp_number, store_address, store_hours, instagram_url, hero_headline, hero_subtext, hero_media_url } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO site_settings (id, store_phone, whatsapp_number, store_address, store_hours, instagram_url, hero_headline, hero_subtext, hero_media_url, updated_at)
       VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       ON CONFLICT (id) DO UPDATE SET
         store_phone = EXCLUDED.store_phone,
         whatsapp_number = EXCLUDED.whatsapp_number,
         store_address = EXCLUDED.store_address,
         store_hours = EXCLUDED.store_hours,
         instagram_url = EXCLUDED.instagram_url,
         hero_headline = EXCLUDED.hero_headline,
         hero_subtext = EXCLUDED.hero_subtext,
         hero_media_url = EXCLUDED.hero_media_url,
         updated_at = NOW()
       RETURNING *`,
      [store_phone, whatsapp_number, store_address, JSON.stringify(store_hours), instagram_url, hero_headline, hero_subtext, hero_media_url]
    );

    return res.json(rows[0]);
  } catch (err: any) {
    Object.assign(memoryStore.settings, req.body);
    return res.json(memoryStore.settings);
  }
});

export default router;
