import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/services — List all active services
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC');
      const formatted = rows.map(r => ({
        ...r,
        symptoms_ar: typeof r.symptoms_ar === 'string' ? JSON.parse(r.symptoms_ar) : r.symptoms_ar,
        symptoms_en: typeof r.symptoms_en === 'string' ? JSON.parse(r.symptoms_en) : r.symptoms_en,
        process_steps_ar: typeof r.process_steps_ar === 'string' ? JSON.parse(r.process_steps_ar) : r.process_steps_ar,
        process_steps_en: typeof r.process_steps_en === 'string' ? JSON.parse(r.process_steps_en) : r.process_steps_en,
        pricing_tiers: typeof r.pricing_tiers === 'string' ? JSON.parse(r.pricing_tiers) : r.pricing_tiers,
        stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : r.stats,
        faqs: typeof r.faqs === 'string' ? JSON.parse(r.faqs) : r.faqs,
      }));
      return res.json({ success: true, data: formatted });
    }
    return res.json({ success: true, data: [], message: 'Running without database' });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/services/:slug — Get single service by slug
router.get('/:slug', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM services WHERE slug = ?', [req.params.slug]);
      if (rows.length > 0) {
        const r = rows[0];
        const formatted = {
          ...r,
          symptoms_ar: typeof r.symptoms_ar === 'string' ? JSON.parse(r.symptoms_ar) : r.symptoms_ar,
          symptoms_en: typeof r.symptoms_en === 'string' ? JSON.parse(r.symptoms_en) : r.symptoms_en,
          process_steps_ar: typeof r.process_steps_ar === 'string' ? JSON.parse(r.process_steps_ar) : r.process_steps_ar,
          process_steps_en: typeof r.process_steps_en === 'string' ? JSON.parse(r.process_steps_en) : r.process_steps_en,
          pricing_tiers: typeof r.pricing_tiers === 'string' ? JSON.parse(r.pricing_tiers) : r.pricing_tiers,
          stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : r.stats,
          faqs: typeof r.faqs === 'string' ? JSON.parse(r.faqs) : r.faqs,
        };
        return res.json({ success: true, data: formatted });
      }
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(404).json({ success: false, message: 'Database not connected' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/services — Create service (Admin only)
router.post('/', authenticateToken, upload.single('hero_image'), async (req, res) => {
  const {
    slug,
    icon,
    title_ar,
    title_en,
    subtitle_ar,
    subtitle_en,
    overview_ar,
    overview_en,
    symptoms_ar,
    symptoms_en,
    process_steps_ar,
    process_steps_en,
    pricing_tiers,
    stats,
    faqs,
    display_order,
  } = req.body;

  const heroImage = req.file ? `/uploads/${req.file.filename}` : (req.body.hero_image || '');

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    const [result] = await pool.query(
      `INSERT INTO services 
      (slug, icon, hero_image, title_ar, title_en, subtitle_ar, subtitle_en, overview_ar, overview_en, symptoms_ar, symptoms_en, process_steps_ar, process_steps_en, pricing_tiers, stats, faqs, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug,
        icon || 'tools',
        heroImage,
        title_ar,
        title_en,
        subtitle_ar || '',
        subtitle_en || '',
        overview_ar || '',
        overview_en || '',
        JSON.stringify(symptoms_ar || []),
        JSON.stringify(symptoms_en || []),
        JSON.stringify(process_steps_ar || []),
        JSON.stringify(process_steps_en || []),
        JSON.stringify(pricing_tiers || []),
        JSON.stringify(stats || []),
        JSON.stringify(faqs || []),
        display_order || 0,
      ]
    );

    return res.status(201).json({ success: true, message: 'Service created successfully', id: result.insertId });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/services/:id — Update service (Admin only)
router.put('/:id', authenticateToken, upload.single('hero_image'), async (req, res) => {
  const { id } = req.params;
  const {
    slug,
    icon,
    title_ar,
    title_en,
    subtitle_ar,
    subtitle_en,
    overview_ar,
    overview_en,
    symptoms_ar,
    symptoms_en,
    process_steps_ar,
    process_steps_en,
    pricing_tiers,
    stats,
    faqs,
    display_order,
    is_active,
  } = req.body;

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    let heroImage = req.body.hero_image;
    if (req.file) {
      heroImage = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE services SET 
      slug = COALESCE(?, slug),
      icon = COALESCE(?, icon),
      hero_image = COALESCE(?, hero_image),
      title_ar = COALESCE(?, title_ar),
      title_en = COALESCE(?, title_en),
      subtitle_ar = COALESCE(?, subtitle_ar),
      subtitle_en = COALESCE(?, subtitle_en),
      overview_ar = COALESCE(?, overview_ar),
      overview_en = COALESCE(?, overview_en),
      symptoms_ar = COALESCE(?, symptoms_ar),
      symptoms_en = COALESCE(?, symptoms_en),
      process_steps_ar = COALESCE(?, process_steps_ar),
      process_steps_en = COALESCE(?, process_steps_en),
      pricing_tiers = COALESCE(?, pricing_tiers),
      stats = COALESCE(?, stats),
      faqs = COALESCE(?, faqs),
      display_order = COALESCE(?, display_order),
      is_active = COALESCE(?, is_active)
      WHERE id = ?`,
      [
        slug,
        icon,
        heroImage,
        title_ar,
        title_en,
        subtitle_ar,
        subtitle_en,
        overview_ar,
        overview_en,
        typeof symptoms_ar === 'object' ? JSON.stringify(symptoms_ar) : symptoms_ar,
        typeof symptoms_en === 'object' ? JSON.stringify(symptoms_en) : symptoms_en,
        typeof process_steps_ar === 'object' ? JSON.stringify(process_steps_ar) : process_steps_ar,
        typeof process_steps_en === 'object' ? JSON.stringify(process_steps_en) : process_steps_en,
        typeof pricing_tiers === 'object' ? JSON.stringify(pricing_tiers) : pricing_tiers,
        typeof stats === 'object' ? JSON.stringify(stats) : stats,
        typeof faqs === 'object' ? JSON.stringify(faqs) : faqs,
        display_order,
        is_active,
        id,
      ]
    );

    return res.json({ success: true, message: 'Service updated successfully' });
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/services/:id — Delete service (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    await pool.query('DELETE FROM services WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
