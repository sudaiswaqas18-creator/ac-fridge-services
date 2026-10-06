import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/gallery — All photos and videos
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [photos] = await pool.query('SELECT * FROM gallery_items ORDER BY display_order ASC, id DESC');
      const [videos] = await pool.query('SELECT * FROM video_items ORDER BY display_order ASC, id DESC');
      return res.json({ success: true, data: { photos, videos } });
    }
    return res.json({ success: true, data: { photos: [], videos: [] } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/gallery/photos — Upload new photo (Admin only)
router.post('/photos', authenticateToken, upload.single('image'), async (req, res) => {
  const { item_key, category, title_ar, title_en, display_order } = req.body;
  const src = req.file ? `/uploads/${req.file.filename}` : (req.body.src || '');

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO gallery_items (item_key, src, category, title_ar, title_en, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [item_key || `item-${Date.now()}`, src, category || 'workshop', title_ar, title_en, display_order || 0]
    );

    res.status(201).json({ success: true, message: 'Photo added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/gallery/photos/:id
router.delete('/photos/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM gallery_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Photo deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
