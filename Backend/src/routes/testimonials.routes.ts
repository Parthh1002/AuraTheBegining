import { Router } from 'express';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// GET /api/testimonials
router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err: any) {
    return res.json(memoryStore.testimonials);
  }
});

// POST /api/testimonials (Admin)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { customer_name, rating, review_text } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO testimonials (customer_name, rating, review_text)
       VALUES ($1, $2, $3) RETURNING *`,
      [customer_name, rating || 5, review_text]
    );
    return res.status(201).json(rows[0]);
  } catch (err: any) {
    const newItem = { id: `t-${Date.now()}`, ...req.body, created_at: new Date().toISOString() };
    memoryStore.testimonials.push(newItem);
    return res.status(201).json(newItem);
  }
});

// PUT /api/testimonials/:id (Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { customer_name, rating, review_text } = req.body;
    const { rows } = await pool.query(
      `UPDATE testimonials SET customer_name=$1, rating=$2, review_text=$3 WHERE id=$4 RETURNING *`,
      [customer_name, rating, review_text, id]
    );
    return res.json(rows[0]);
  } catch (err: any) {
    const idx = memoryStore.testimonials.findIndex((t) => t.id === req.params.id);
    if (idx !== -1) {
      memoryStore.testimonials[idx] = { ...memoryStore.testimonials[idx], ...req.body };
      return res.json(memoryStore.testimonials[idx]);
    }
    return res.json({ id: req.params.id, ...req.body });
  }
});

// DELETE /api/testimonials/:id (Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM testimonials WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err: any) {
    memoryStore.testimonials = memoryStore.testimonials.filter((t) => t.id !== req.params.id);
    return res.json({ success: true });
  }
});

export default router;
