import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/industries
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM industries ORDER BY display_order ASC');
      const formatted = rows.map(r => ({
        ...r,
        features_ar: typeof r.features_ar === 'string' ? JSON.parse(r.features_ar) : r.features_ar,
        features_en: typeof r.features_en === 'string' ? JSON.parse(r.features_en) : r.features_en,
      }));
      return res.json({ success: true, data: formatted });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/industries (Admin only)
router.post('/', authenticateToken, async (req, res) => {
  const { industry_key, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, display_order } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO industries (industry_key, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [industry_key, icon || 'bolt', title_ar, title_en, desc_ar, desc_en, JSON.stringify(features_ar || []), JSON.stringify(features_en || []), display_order || 0]
    );

    res.status(201).json({ success: true, message: 'Industry created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/industries/:id (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { industry_key, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, display_order } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query(
      `UPDATE industries SET 
       industry_key = COALESCE(?, industry_key),
       icon = COALESCE(?, icon),
       title_ar = COALESCE(?, title_ar),
       title_en = COALESCE(?, title_en),
       desc_ar = COALESCE(?, desc_ar),
       desc_en = COALESCE(?, desc_en),
       features_ar = COALESCE(?, features_ar),
       features_en = COALESCE(?, features_en),
       display_order = COALESCE(?, display_order)
       WHERE id = ?`,
      [
        industry_key,
        icon,
        title_ar,
        title_en,
        desc_ar,
        desc_en,
        typeof features_ar === 'object' ? JSON.stringify(features_ar) : features_ar,
        typeof features_en === 'object' ? JSON.stringify(features_en) : features_en,
        display_order,
        id,
      ]
    );

    res.json({ success: true, message: 'Industry updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/industries/:id (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM industries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Industry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
