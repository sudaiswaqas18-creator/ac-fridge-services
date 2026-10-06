import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredFaqs,
  saveStoredFaq,
  deleteStoredFaq,
} from '../config/store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM faqs ORDER BY display_order ASC, id ASC');
      if (rows && rows.length > 0) return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: getStoredFaqs() });
  } catch (error) {
    return res.json({ success: true, data: getStoredFaqs() });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const faqItem = req.body;
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO faqs (q_ar, q_en, a_ar, a_en) VALUES (?, ?, ?, ?)`,
        [faqItem.qAr || faqItem.q_ar, faqItem.qEn || faqItem.q_en, faqItem.aAr || faqItem.a_ar, faqItem.aEn || faqItem.a_en]
      );
    }
    saveStoredFaq(faqItem);
    return res.status(201).json({ success: true, message: 'FAQ added', data: faqItem });
  } catch (error) {
    saveStoredFaq(faqItem);
    return res.json({ success: true, message: 'FAQ added to store', data: faqItem });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    }
    deleteStoredFaq(req.params.id);
    return res.json({ success: true, message: 'FAQ deleted' });
  } catch (error) {
    deleteStoredFaq(req.params.id);
    return res.json({ success: true, message: 'FAQ deleted from store' });
  }
});

export default router;
