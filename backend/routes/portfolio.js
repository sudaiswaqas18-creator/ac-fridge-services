import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredCases,
  saveStoredCase,
  deleteStoredCase,
} from '../config/store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM case_studies ORDER BY display_order ASC');
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: getStoredCases() });
  } catch (error) {
    return res.json({ success: true, data: getStoredCases() });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const caseItem = req.body;
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO case_studies (case_key, title_ar, title_en, category_ar, category_en) VALUES (?, ?, ?, ?, ?)`,
        [caseItem.id || `case-${Date.now()}`, caseItem.titleAr || caseItem.title_ar, caseItem.titleEn || caseItem.title_en, caseItem.categoryAr || caseItem.category_ar, caseItem.categoryEn || caseItem.category_en]
      );
    }
    saveStoredCase(caseItem);
    return res.status(201).json({ success: true, message: 'Case study saved', data: caseItem });
  } catch (error) {
    saveStoredCase(caseItem);
    return res.json({ success: true, message: 'Case study saved to store', data: caseItem });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM case_studies WHERE id = ? OR case_key = ?', [req.params.id, req.params.id]);
    }
    deleteStoredCase(req.params.id);
    return res.json({ success: true, message: 'Case study deleted' });
  } catch (error) {
    deleteStoredCase(req.params.id);
    return res.json({ success: true, message: 'Case study deleted from store' });
  }
});

export default router;
