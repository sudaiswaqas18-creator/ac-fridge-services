import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredPosts,
  saveStoredPost,
  deleteStoredPost,
} from '../config/store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC');
      if (rows && rows.length > 0) {
        const formatted = rows.map(r => ({
          ...r,
          id: r.id,
          slug: r.slug,
          titleAr: r.title_ar,
          titleEn: r.title_en,
          categoryAr: r.category_ar,
          categoryEn: r.category_en,
          excerptAr: r.excerpt_ar,
          excerptEn: r.excerpt_en,
          readTimeAr: r.read_time_ar,
          readTimeEn: r.read_time_en,
          image: r.image,
          date: r.published_at || '2026',
        }));
        return res.json({ success: true, data: formatted });
      }
    }
    return res.json({ success: true, data: getStoredPosts() });
  } catch (error) {
    return res.json({ success: true, data: getStoredPosts() });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const postItem = req.body;
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO blog_posts (slug, title_ar, title_en, excerpt_ar, excerpt_en) VALUES (?, ?, ?, ?, ?)`,
        [postItem.slug, postItem.titleAr || postItem.title_ar, postItem.titleEn || postItem.title_en, postItem.excerptAr || postItem.excerpt_ar, postItem.excerptEn || postItem.excerpt_en]
      );
    }
    saveStoredPost(postItem);
    return res.status(201).json({ success: true, message: 'Post saved', data: postItem });
  } catch (error) {
    saveStoredPost(postItem);
    return res.json({ success: true, message: 'Post saved to store', data: postItem });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM blog_posts WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    }
    deleteStoredPost(req.params.id);
    return res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    deleteStoredPost(req.params.id);
    return res.json({ success: true, message: 'Post deleted from store' });
  }
});

export default router;
