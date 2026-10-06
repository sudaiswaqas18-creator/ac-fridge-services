import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredReviews,
  saveStoredReview,
  deleteStoredReview,
} from '../config/store.js';

const router = express.Router();

// GET /api/reviews
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY display_order ASC, id DESC');
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows });
      }
    }
    return res.json({ success: true, data: getStoredReviews() });
  } catch (error) {
    return res.json({ success: true, data: getStoredReviews() });
  }
});

// POST /api/reviews
router.post('/', authenticateToken, async (req, res) => {
  const { name_ar, name_en, nameAr, nameEn, area_ar, area_en, areaAr, areaEn, service_ar, service_en, serviceAr, serviceEn, text_ar, text_en, textAr, textEn, rating, date_str, date } = req.body;

  const reviewItem = {
    id: req.body.id || Date.now(),
    nameAr: nameAr || name_ar || '',
    nameEn: nameEn || name_en || nameAr || name_ar || '',
    areaAr: areaAr || area_ar || 'حي الياسمين — الرياض',
    areaEn: areaEn || area_en || 'Al-Yasmin District — Riyadh',
    serviceAr: serviceAr || service_ar || '',
    serviceEn: serviceEn || service_en || '',
    textAr: textAr || text_ar || '',
    textEn: textEn || text_en || '',
    rating: Number(rating || 5),
    date: date || date_str || '2026',
  };

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO testimonials (name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, date_str) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [reviewItem.nameAr, reviewItem.nameEn, reviewItem.areaAr, reviewItem.areaEn, reviewItem.serviceAr, reviewItem.serviceEn, reviewItem.textAr, reviewItem.textEn, reviewItem.rating, reviewItem.date]
      );
    }
    saveStoredReview(reviewItem);
    return res.status(201).json({ success: true, message: 'Review added successfully', data: reviewItem });
  } catch (error) {
    saveStoredReview(reviewItem);
    return res.json({ success: true, message: 'Review added to store', data: reviewItem });
  }
});

// PUT /api/reviews/:id
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const reviewItem = { ...req.body, id };

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `UPDATE testimonials SET 
         name_ar = COALESCE(?, name_ar),
         rating = COALESCE(?, rating)
         WHERE id = ?`,
        [reviewItem.nameAr || reviewItem.name_ar, reviewItem.rating, id]
      );
    }
    saveStoredReview(reviewItem);
    return res.json({ success: true, message: 'Review updated successfully', data: reviewItem });
  } catch (error) {
    saveStoredReview(reviewItem);
    return res.json({ success: true, message: 'Review updated in store', data: reviewItem });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    }
    deleteStoredReview(req.params.id);
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    deleteStoredReview(req.params.id);
    return res.json({ success: true, message: 'Review deleted from store' });
  }
});

export default router;
