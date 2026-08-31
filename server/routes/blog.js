import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/blog — List all published posts
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY published_at DESC, id DESC');
      return res.json({ success: true, data: rows });
    }
    return res.json({ success: true, data: [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/blog/:slug — Single post
router.get('/:slug', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM blog_posts WHERE slug = ?', [req.params.slug]);
      if (rows.length > 0) {
        return res.json({ success: true, data: rows[0] });
      }
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    return res.status(404).json({ success: false, message: 'Database not connected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/blog (Admin only)
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  const { slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, content_ar, content_en, read_time_ar, read_time_en } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : (req.body.image || '');

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO blog_posts (slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, content_ar, content_en, image, read_time_ar, read_time_en, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, content_ar, content_en, image, read_time_ar, read_time_en]
    );

    res.status(201).json({ success: true, message: 'Blog post created successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/blog/:id (Admin only)
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, content_ar, content_en, read_time_ar, read_time_en, is_published } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE blog_posts SET 
       slug = COALESCE(?, slug),
       title_ar = COALESCE(?, title_ar),
       title_en = COALESCE(?, title_en),
       category_ar = COALESCE(?, category_ar),
       category_en = COALESCE(?, category_en),
       excerpt_ar = COALESCE(?, excerpt_ar),
       excerpt_en = COALESCE(?, excerpt_en),
       content_ar = COALESCE(?, content_ar),
       content_en = COALESCE(?, content_en),
       image = COALESCE(?, image),
       read_time_ar = COALESCE(?, read_time_ar),
       read_time_en = COALESCE(?, read_time_en),
       is_published = COALESCE(?, is_published)
       WHERE id = ?`,
      [slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, content_ar, content_en, image, read_time_ar, read_time_en, is_published, id]
    );

    res.json({ success: true, message: 'Blog post updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/blog/:id (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
