import { Router } from 'express';
import { pool } from '../config/db';
import { sendNewsletterConfirmation } from '../services/brevo';

const router = Router();

// POST /api/newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address required.' });
    }

    await pool.query(
      `INSERT INTO subscribers (email, confirmed)
       VALUES ($1, false)
       ON CONFLICT (email) DO NOTHING`,
      [email.trim()]
    );

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const confirmUrl = `${frontendUrl}/confirm-subscription?email=${encodeURIComponent(email.trim())}`;

    sendNewsletterConfirmation(email.trim(), confirmUrl).catch(console.error);

    return res.json({ success: true });
  } catch (err: any) {
    console.error('Newsletter Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/newsletter/confirm
router.get('/confirm', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter missing' });
    }

    await pool.query(
      `UPDATE subscribers SET confirmed = true WHERE email = $1`,
      [email as string]
    );

    return res.json({ success: true, email });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

export default router;
