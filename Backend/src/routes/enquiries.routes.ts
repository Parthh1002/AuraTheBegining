import { Router } from 'express';
import { pool } from '../config/db';
import { authMiddleware } from '../middleware/auth';
import { sendOwnerEnquiryAlert } from '../services/brevo';

const router = Router();

// GET /api/enquiries (Admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, source } = req.query;

    let query = `
      SELECT e.*, p.name as product_name, p.slug as product_slug, p.price_label
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      WHERE 1=1
    `;
    const values: any[] = [];

    if (status && status !== 'all') {
      values.push(status);
      query += ` AND e.status = $${values.length}`;
    }

    if (source && source !== 'all') {
      values.push(source);
      query += ` AND e.source = $${values.length}`;
    }

    query += ` ORDER BY e.created_at DESC`;

    const { rows } = await pool.query(query, values);
    return res.json(rows);
  } catch (err: any) {
    console.error('Fetch Enquiries Error:', err);
    return res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
});

// GET /api/enquiries/stats (Admin Dashboard)
router.get('/stats', authMiddleware, async (_req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayRes = await pool.query('SELECT COUNT(*)::int FROM enquiries WHERE created_at >= $1', [todayStart]);
    const lowStockRes = await pool.query('SELECT COUNT(*)::int FROM products WHERE in_stock = false');
    const recentRes = await pool.query(`
      SELECT e.*, p.name as product_name
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      ORDER BY e.created_at DESC LIMIT 5
    `);

    return res.json({
      newTodayCount: todayRes.rows[0].count,
      lowStockCount: lowStockRes.rows[0].count,
      recentEnquiries: recentRes.rows,
    });
  } catch (err: any) {
    console.error('Fetch Stats Error:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// POST /api/enquiries (Public)
router.post('/', async (req, res) => {
  try {
    const { source, name, phone, email, message, product_id } = req.body;

    const { rows } = await pool.query(
      `INSERT INTO enquiries (source, name, phone, email, message, product_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new') RETURNING *`,
      [source || 'whatsapp_product', name || null, phone || null, email || null, message || null, product_id || null]
    );

    const enquiry = rows[0];

    sendOwnerEnquiryAlert({
      source: source === 'stock_notify' ? 'Stock Notification Request' : 'WhatsApp Product Click',
      name,
      phone,
      email,
      message,
    }).catch(console.error);

    return res.status(201).json(enquiry);
  } catch (err: any) {
    console.error('Create Enquiry Error:', err);
    return res.status(500).json({ error: 'Failed to record enquiry' });
  }
});

// PATCH /api/enquiries/:id (Admin)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    let query = 'UPDATE enquiries SET ';
    const updates: string[] = [];
    const values: any[] = [];

    if (status !== undefined) {
      values.push(status);
      updates.push(`status = $${values.length}`);
    }

    if (notes !== undefined) {
      values.push(notes);
      updates.push(`notes = $${values.length}`);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);
    query += updates.join(', ') + ` WHERE id = $${values.length} RETURNING *`;

    const { rows } = await pool.query(query, values);
    return res.json(rows[0]);
  } catch (err: any) {
    console.error('Update Enquiry Error:', err);
    return res.status(500).json({ error: 'Failed to update enquiry' });
  }
});

export default router;
