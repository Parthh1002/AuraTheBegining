import { Router } from 'express';
import { upload } from '../middleware/upload';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// POST /api/upload (Admin multi-image upload)
router.post('/', authMiddleware, upload.array('files', 10), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    const host = req.get('host') || 'localhost:5000';
    const protocol = req.protocol;

    const urls = files.map((f) => `${protocol}://${host}/uploads/${f.filename}`);

    return res.json({
      success: true,
      urls,
    });
  } catch (err: any) {
    console.error('Upload Error:', err);
    return res.status(500).json({ error: 'Failed to upload files' });
  }
});

export default router;
