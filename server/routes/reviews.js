import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY display_order ASC, id DESC');
      return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/reviews (Admin or public review submission)
router.post('/', authenticateToken, async (req, res) => {
  const { name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, date_str } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO testimonials (name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, date_str) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name_ar, name_en || name_ar, area_ar, area_en || area_ar, service_ar, service_en || service_ar, text_ar, text_en || text_ar, rating || 5, date_str || '2026']
    );

    res.status(201).json({ success: true, message: 'Review added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/reviews/:id (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, is_verified, display_order } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query(
      `UPDATE testimonials SET 
       name_ar = COALESCE(?, name_ar),
       name_en = COALESCE(?, name_en),
       area_ar = COALESCE(?, area_ar),
       area_en = COALESCE(?, area_en),
       service_ar = COALESCE(?, service_ar),
       service_en = COALESCE(?, service_en),
       text_ar = COALESCE(?, text_ar),
       text_en = COALESCE(?, text_en),
       rating = COALESCE(?, rating),
       is_verified = COALESCE(?, is_verified),
       display_order = COALESCE(?, display_order)
       WHERE id = ?`,
      [name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, is_verified, display_order, id]
    );

    res.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/reviews/:id (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
