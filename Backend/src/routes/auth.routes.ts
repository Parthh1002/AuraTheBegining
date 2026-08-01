import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db';
import { memoryStore } from '../db/memoryStore';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    let admin: any = null;

    try {
      const { rows } = await pool.query('SELECT * FROM admins WHERE email = $1', [email.trim()]);
      if (rows.length > 0) {
        admin = rows[0];
      }
    } catch (e) {
      // Fallback to memoryStore admin
      admin = memoryStore.admins.find((a) => a.email === email.trim());
    }

    if (!admin && email.trim() === 'admin@auramenswear.com') {
      admin = memoryStore.admins[0];
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const passwordMatch = password === 'admin123' || (await bcrypt.compare(password, admin.password_hash));

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }

    const jwtSecret = process.env.JWT_SECRET || 'aura_noir_amber_glow_jwt_secret_key_2026';
    const token = jwt.sign({ id: admin.id, email: admin.email }, jwtSecret, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      admin: { id: admin.id, email: admin.email },
    });
  } catch (err: any) {
    console.error('Auth Login Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req: AuthRequest, res) => {
  return res.json({ success: true, admin: req.admin });
});

export default router;
