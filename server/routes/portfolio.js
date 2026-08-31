import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/portfolio
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM case_studies ORDER BY display_order ASC, id DESC');
      const formatted = rows.map(r => ({
        ...r,
        metrics: typeof r.metrics === 'string' ? JSON.parse(r.metrics) : r.metrics,
      }));
      return res.json({ success: true, data: formatted });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/portfolio/:caseKey
router.get('/:caseKey', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM case_studies WHERE case_key = ?', [req.params.caseKey]);
      if (rows.length > 0) {
        const r = rows[0];
        return res.json({
          success: true,
          data: {
            ...r,
            metrics: typeof r.metrics === 'string' ? JSON.parse(r.metrics) : r.metrics,
          },
        });
      }
      return res.status(404).json({ success: false, message: 'Case study not found' });
    }
    return res.status(404).json({ success: false, message: 'Database not connected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/portfolio (Admin only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { case_key, title_ar, title_en, category_ar, category_en, client_ar, client_en, date_str, metrics, challenge_ar, challenge_en, solution_ar, solution_en, display_order } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO case_studies 
      (case_key, title_ar, title_en, category_ar, category_en, client_ar, client_en, date_str, image, metrics, challenge_ar, challenge_en, solution_ar, solution_en, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_key,
        title_ar,
        title_en,
        category_ar,
        category_en,
        client_ar,
        client_en,
        date_str || '2026',
        image,
        JSON.stringify(metrics || []),
        challenge_ar,
        challenge_en,
        solution_ar,
        solution_en,
        display_order || 0,
      ]
    );

    res.status(201).json({ success: true, message: 'Case study created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/portfolio/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM case_studies WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Case study deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
