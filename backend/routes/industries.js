import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredIndustries,
  saveStoredIndustry,
  deleteStoredIndustry,
} from '../config/store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM industries ORDER BY display_order ASC');
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: getStoredIndustries() });
  } catch (error) {
    return res.json({ success: true, data: getStoredIndustries() });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const item = req.body;
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO industries (industry_key, title_ar, title_en, desc_ar, desc_en) VALUES (?, ?, ?, ?, ?)`,
        [item.id || `ind-${Date.now()}`, item.titleAr || item.title_ar, item.titleEn || item.title_en, item.descAr || item.desc_ar, item.descEn || item.desc_en]
      );
    }
    saveStoredIndustry(item);
    return res.status(201).json({ success: true, message: 'Industry saved', data: item });
  } catch (error) {
    saveStoredIndustry(item);
    return res.json({ success: true, message: 'Industry saved to store', data: item });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM industries WHERE id = ? OR industry_key = ?', [req.params.id, req.params.id]);
    }
    deleteStoredIndustry(req.params.id);
    return res.json({ success: true, message: 'Industry deleted' });
  } catch (error) {
    deleteStoredIndustry(req.params.id);
    return res.json({ success: true, message: 'Industry deleted from store' });
  }
});

export default router;
