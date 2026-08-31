import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/faqs
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
      return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/faqs (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { q_ar, q_en, a_ar, a_en, category, display_order } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      'INSERT INTO faqs (q_ar, q_en, a_ar, a_en, category, display_order) VALUES (?, ?, ?, ?, ?, ?)',
      [q_ar, q_en, a_ar, a_en, category || 'general', display_order || 0]
    );

    res.status(201).json({ success: true, message: 'FAQ created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/faqs/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
