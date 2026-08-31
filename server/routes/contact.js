import express from 'express';
import { getDbPool } from '../config/database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (!pool) {
      return res.json({ success: true, data: [] });
    }

    const [rows] = await pool.query(
      'SELECT id, name, phone, area, service, notes, status, created_at FROM contact_inquiries ORDER BY created_at DESC'
    );

    return res.json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, phone, area, service, notes, status } = req.body || {};

  if (!name || !phone || !service) {
    return res.status(400).json({
      success: false,
      message: 'Name, phone, and service are required.',
    });
  }

  try {
    const payload = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      area: String(area || 'Riyadh').trim(),
      service: String(service).trim(),
      notes: String(notes || '').trim(),
      status: String(status || 'new').trim(),
    };

    const pool = await getDbPool();

    if (pool) {
      await pool.query(
        `INSERT INTO contact_inquiries (name, phone, area, service, notes, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [payload.name, payload.phone, payload.area, payload.service, payload.notes, payload.status]
      );
    }

    return res.json({
      success: true,
      message: 'Inquiry received successfully.',
      data: payload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
