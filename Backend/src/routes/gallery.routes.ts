import { Router } from 'express';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/gallery
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM gallery_items ORDER BY display_order ASC, created_at DESC');
    return res.json(rows);
  } catch (err: any) {
    return res.json(memoryStore.gallery);
  }
});

// POST /api/gallery (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { storage_path, caption, instagram_url, display_order } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO gallery_items (storage_path, caption, instagram_url, display_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [storage_path, caption, instagram_url || null, display_order || 0]
    );
    return res.status(201).json(rows[0]);
  } catch (err: any) {
    const newItem = { id: `g-${Date.now()}`, ...req.body, created_at: new Date().toISOString() };
    memoryStore.gallery.push(newItem);
    return res.status(201).json(newItem);
  }
});

// DELETE /api/gallery/:id (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM gallery_items WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err: any) {
    memoryStore.gallery = memoryStore.gallery.filter((g) => g.id !== req.params.id);
    return res.json({ success: true });
  }
});

export default router;
