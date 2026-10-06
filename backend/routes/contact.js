import express from 'express';
import { getDbPool } from '../config/database.js';
import {
  getStoredInquiries,
  saveStoredInquiry,
  updateStoredInquiryStatus,
  deleteStoredInquiry,
} from '../config/store.js';

const router = express.Router();

// GET /api/contact — List all inquiries
router.get('/', async (req, res) => {
  try {
    const pool = await getDbPool();
    if (pool) {
      const [rows] = await pool.query(
        'SELECT id, name, phone, area, service, notes, status, created_at FROM contact_inquiries ORDER BY created_at DESC'
      );
      if (rows && rows.length > 0) {
        return res.json({ success: true, data: rows });
      }
    }
    return res.json({ success: true, data: getStoredInquiries() });
  } catch (error) {
    return res.json({ success: true, data: getStoredInquiries() });
  }
});

// POST /api/contact — Submit inquiry / booking
router.post('/', async (req, res) => {
  const { name, phone, area, service, notes, status } = req.body || {};

  const payload = {
    id: req.body?.id || `inq-${Date.now()}`,
    name: String(name || 'عميل جوزاء').trim(),
    phone: String(phone || '').trim(),
    area: String(area || 'الرياض').trim(),
    service: String(service || 'صيانة عامة').trim(),
    notes: String(notes || '').trim(),
    date: new Date().toLocaleString('ar-SA'),
    status: String(status || 'new').trim(),
  };

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query(
        `INSERT INTO contact_inquiries (name, phone, area, service, notes, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [payload.name, payload.phone, payload.area, payload.service, payload.notes, payload.status]
      );
    }
    const saved = saveStoredInquiry(payload);
    return res.json({
      success: true,
      message: 'Inquiry received successfully.',
      data: saved,
    });
  } catch (error) {
    const saved = saveStoredInquiry(payload);
    return res.json({
      success: true,
      message: 'Inquiry received and saved to store.',
      data: saved,
    });
  }
});

// PATCH /api/contact/:id/status — Update status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('UPDATE contact_inquiries SET status = ? WHERE id = ?', [status, id]);
    }
    const updated = updateStoredInquiryStatus(id, status);
    return res.json({ success: true, message: 'Status updated', data: updated });
  } catch (error) {
    const updated = updateStoredInquiryStatus(id, status);
    return res.json({ success: true, message: 'Status updated in store', data: updated });
  }
});

// DELETE /api/contact/:id — Delete inquiry
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await getDbPool();
    if (pool) {
      await pool.query('DELETE FROM contact_inquiries WHERE id = ?', [id]);
    }
    deleteStoredInquiry(id);
    return res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    deleteStoredInquiry(id);
    return res.json({ success: true, message: 'Inquiry deleted from store' });
  }
});

export default router;
