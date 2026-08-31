import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
      const settings = {};
      rows.forEach(r => {
        settings[r.setting_key] = r.setting_value;
      });
      return res.json({ success: true, data: settings });
    }
    return res.json({ success: true, data: {} });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/settings (Admin only — save or update multiple settings)
router.post('/', authenticateToken, async (req, res) => {
  const settings = req.body; // e.g. { phonePrimary: "0544786559", ... }

  try {
    const pool = await getDbPool();
    if (!pool) return res.status(500).json({ success: false, message: 'Database not available' });

    for (const [key, val] of Object.entries(settings)) {
      await pool.query(
        `INSERT INTO site_settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
      );
    }

    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
