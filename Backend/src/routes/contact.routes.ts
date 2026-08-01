import { Router } from 'express';
import { pool } from '../config/db';
import { sendCustomerAutoReply, sendOwnerEnquiryAlert } from '../services/brevo';

const router = Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ error: 'Name, phone, and message are required fields.' });
    }

    const { rows } = await pool.query(
      `INSERT INTO enquiries (source, name, phone, email, message, status)
       VALUES ('contact_form', $1, $2, $3, $4, 'new') RETURNING *`,
      [name, phone, email || null, message]
    );

    const enquiry = rows[0];

    if (email) {
      sendCustomerAutoReply(email, name).catch(console.error);
    }
    sendOwnerEnquiryAlert({
      source: 'Contact Form',
      name,
      phone,
      email,
      message,
    }).catch(console.error);

    return res.status(201).json({ success: true, enquiryId: enquiry.id });
  } catch (err: any) {
    console.error('Contact Form Error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
