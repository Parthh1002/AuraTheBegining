import { Router } from 'express';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/collections
router.get('/', async (_req, res) => {
  try {
    const query = `
      SELECT c.*, COUNT(p.id)::int as product_count
      FROM collections c
      LEFT JOIN products p ON c.id = p.collection_id
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.created_at DESC
    `;
    const { rows } = await pool.query(query);
    return res.json(rows);
  } catch (err: any) {
    return res.json(memoryStore.collections);
  }
});

// GET /api/collections/:slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { rows } = await pool.query('SELECT * FROM collections WHERE slug = $1', [slug]);
    if (rows.length === 0) {
      const col = memoryStore.collections.find((c) => c.slug === slug);
      if (!col) return res.status(404).json({ error: 'Collection not found' });
      return res.json(col);
    }
    return res.json(rows[0]);
  } catch (err: any) {
    const col = memoryStore.collections.find((c) => c.slug === req.params.slug);
    if (!col) return res.status(404).json({ error: 'Collection not found' });
    return res.json(col);
  }
});

// POST /api/collections (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, slug, description, cover_image_url, is_featured } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO collections (name, slug, description, cover_image_url, is_featured)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, slug, description, cover_image_url, is_featured ?? false]
    );
    return res.status(201).json(rows[0]);
  } catch (err: any) {
    const newCol = { id: `c-${Date.now()}`, ...req.body };
    memoryStore.collections.push(newCol);
    return res.status(201).json(newCol);
  }
});

// PUT /api/collections/:id (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description, cover_image_url, is_featured } = req.body;
    const { rows } = await pool.query(
      `UPDATE collections
       SET name=$1, slug=$2, description=$3, cover_image_url=$4, is_featured=$5
       WHERE id=$6 RETURNING *`,
      [name, slug, description, cover_image_url, is_featured, id]
    );
    return res.json(rows[0]);
  } catch (err: any) {
    const idx = memoryStore.collections.findIndex((c) => c.id === req.params.id);
    if (idx !== -1) {
      memoryStore.collections[idx] = { ...memoryStore.collections[idx], ...req.body };
      return res.json(memoryStore.collections[idx]);
    }
    return res.json({ id: req.params.id, ...req.body });
  }
});

// DELETE /api/collections/:id (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM collections WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err: any) {
    memoryStore.collections = memoryStore.collections.filter((c) => c.id !== req.params.id);
    return res.json({ success: true });
  }
});

export default router;
