import express from 'express';
import { getDbPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  getStoredSettings,
  saveStoredSettings,
} from '../config/store.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
      if (rows && rows.length > 0) {
        const settings = {};
        rows.forEach(r => {
          settings[r.setting_key] = r.setting_value;
        });
        return res.json({ success: true, data: settings });
      }
    }
    return res.json({ success: true, data: getStoredSettings() });
  } catch (error) {
    return res.json({ success: true, data: getStoredSettings() });
  }
});

router.post('/', authenticateToken, async (req, res) => {
  const settings = req.body;
  try {
    const pool = await getDbPool();
    if (pool) {
      for (const [key, val] of Object.entries(settings)) {
        await pool.query(
          `INSERT INTO site_settings (setting_key, setting_value) 
           VALUES (?, ?) 
           ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
          [key, typeof val === 'object' ? JSON.stringify(val) : String(val)]
        );
      }
    }
    const saved = saveStoredSettings(settings);
    return res.json({ success: true, message: 'Settings saved', data: saved });
  } catch (error) {
    const saved = saveStoredSettings(settings);
    return res.json({ success: true, message: 'Settings saved to store', data: saved });
  }
});

export default router;
