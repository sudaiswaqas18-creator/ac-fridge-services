import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/careers
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM careers WHERE is_open = TRUE ORDER BY id DESC');
      return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/careers (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { career_key, title_ar, title_en, type_ar, type_en, experience_ar, experience_en, desc_ar, desc_en } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO careers (career_key, title_ar, title_en, type_ar, type_en, experience_ar, experience_en, desc_ar, desc_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [career_key || `job-${Date.now()}`, title_ar, title_en, type_ar, type_en, experience_ar, experience_en, desc_ar, desc_en]
    );

    res.status(201).json({ success: true, message: 'Job opening added', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/careers/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM careers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
