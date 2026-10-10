import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getStoredServices,
  saveStoredService,
  deleteStoredService,
} from '../config/store.js';

const router = express.Router();

// GET /api/services — List all active services
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY display_order ASC');
      const formatted = rows.map(r => ({
        ...r,
        titleAr: r.title_ar,
        titleEn: r.title_en,
        subtitleAr: r.subtitle_ar,
        subtitleEn: r.subtitle_en,
        overviewAr: r.overview_ar,
        overviewEn: r.overview_en,
        heroImage: r.hero_image,
        symptomsAddressedAr: typeof r.symptoms_ar === 'string' ? JSON.parse(r.symptoms_ar) : (r.symptoms_ar || []),
        symptomsAddressedEn: typeof r.symptoms_en === 'string' ? JSON.parse(r.symptoms_en) : (r.symptoms_en || []),
        processStepsAr: typeof r.process_steps_ar === 'string' ? JSON.parse(r.process_steps_ar) : (r.process_steps_ar || []),
        processStepsEn: typeof r.process_steps_en === 'string' ? JSON.parse(r.process_steps_en) : (r.process_steps_en || []),
        pricingTiers: typeof r.pricing_tiers === 'string' ? JSON.parse(r.pricing_tiers) : (r.pricing_tiers || []),
        stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : (r.stats || []),
        faqs: typeof r.faqs === 'string' ? JSON.parse(r.faqs) : (r.faqs || []),
      }));
      return res.json({ success: true, data: formatted });
    }
    return res.json({ success: true, data: getStoredServices() });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.json({ success: true, data: getStoredServices() });
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
          titleAr: r.title_ar,
          titleEn: r.title_en,
          subtitleAr: r.subtitle_ar,
          subtitleEn: r.subtitle_en,
          overviewAr: r.overview_ar,
          overviewEn: r.overview_en,
          heroImage: r.hero_image,
          symptomsAddressedAr: typeof r.symptoms_ar === 'string' ? JSON.parse(r.symptoms_ar) : (r.symptoms_ar || []),
          symptomsAddressedEn: typeof r.symptoms_en === 'string' ? JSON.parse(r.symptoms_en) : (r.symptoms_en || []),
          processStepsAr: typeof r.process_steps_ar === 'string' ? JSON.parse(r.process_steps_ar) : (r.process_steps_ar || []),
          processStepsEn: typeof r.process_steps_en === 'string' ? JSON.parse(r.process_steps_en) : (r.process_steps_en || []),
          pricingTiers: typeof r.pricing_tiers === 'string' ? JSON.parse(r.pricing_tiers) : (r.pricing_tiers || []),
          stats: typeof r.stats === 'string' ? JSON.parse(r.stats) : (r.stats || []),
          faqs: typeof r.faqs === 'string' ? JSON.parse(r.faqs) : (r.faqs || []),
        };
        return res.json({ success: true, data: formatted });
      }
    }
    const stored = getStoredServices().find(s => s.slug === req.params.slug);
    if (stored) return res.json({ success: true, data: stored });
    return res.status(404).json({ success: false, message: 'Service not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/services — Create or update service (Admin only)
router.post('/', authenticateToken, upload.single('hero_image'), async (req, res) => {
  const {
    slug,
    icon,
    title_ar,
    title_en,
    titleAr,
    titleEn,
    subtitle_ar,
    subtitle_en,
    subtitleAr,
    subtitleEn,
    overview_ar,
    overview_en,
    overviewAr,
    overviewEn,
    symptoms_ar,
    symptoms_en,
    process_steps_ar,
    process_steps_en,
    pricing_tiers,
    stats,
    faqs,
    display_order,
  } = req.body;

  const heroImage = req.file ? `/uploads/${req.file.filename}` : req.body.hero_image || req.body.heroImage || '';

  const svcData = {
    slug: slug || `svc-${Date.now()}`,
    icon: icon || 'tools',
    heroImage,
    titleAr: titleAr || title_ar || '',
    titleEn: titleEn || title_en || '',
    subtitleAr: subtitleAr || subtitle_ar || '',
    subtitleEn: subtitleEn || subtitle_en || '',
    overviewAr: overviewAr || overview_ar || '',
    overviewEn: overviewEn || overview_en || '',
    symptomsAr: symptoms_ar || [],
    symptomsEn: symptoms_en || [],
    processStepsAr: process_steps_ar || [],
    processStepsEn: process_steps_en || [],
    pricingTiers: pricing_tiers || [],
    stats: stats || {},
    faqs: faqs || [],
    displayOrder: Number(display_order || 0),
  };

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO services 
        (slug, icon, hero_image, title_ar, title_en, subtitle_ar, subtitle_en, overview_ar, overview_en, 
         symptoms_ar, symptoms_en, process_steps_ar, process_steps_en, pricing_tiers, stats, faqs, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        icon = VALUES(icon),
        title_ar = VALUES(title_ar),
        title_en = VALUES(title_en),
        subtitle_ar = VALUES(subtitle_ar),
        subtitle_en = VALUES(subtitle_en),
        overview_ar = VALUES(overview_ar),
        overview_en = VALUES(overview_en),
        display_order = VALUES(display_order)`,
        [
          svcData.slug,
          svcData.icon,
          heroImage,
          svcData.titleAr,
          svcData.titleEn,
          svcData.subtitleAr,
          svcData.subtitleEn,
          svcData.overviewAr,
          svcData.overviewEn,
          JSON.stringify(svcData.symptomsAr),
          JSON.stringify(svcData.symptomsEn),
          JSON.stringify(svcData.processStepsAr),
          JSON.stringify(svcData.processStepsEn),
          JSON.stringify(svcData.pricingTiers),
          JSON.stringify(svcData.stats),
          JSON.stringify(svcData.faqs),
          svcData.displayOrder,
        ]
      );
    }

    saveStoredService(svcData);
    return res.status(201).json({ success: true, message: 'Service saved successfully', data: svcData });
  } catch (error) {
    saveStoredService(svcData);
    return res.json({ success: true, message: 'Service saved to local store', data: svcData });
  }
});

// DELETE /api/services/:id — Delete service (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM services WHERE id = ? OR slug = ?', [req.params.id, req.params.id]);
    }
    deleteStoredService(req.params.id);
    return res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    deleteStoredService(req.params.id);
    return res.json({ success: true, message: 'Service deleted from store' });
  }
});

export default router;
