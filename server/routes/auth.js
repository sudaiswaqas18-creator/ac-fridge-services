import express from 'express';
import bcrypt from 'bcryptjs';
import { getDbPool } from '../config/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory fallback default admin
const DEFAULT_ADMIN = {
  username: 'admin',
  passwordHash: bcrypt.hashSync('admin123', 10),
  role: 'superadmin',
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    const pool = await getDbPool();

    if (pool) {
      const [rows] = await pool.query('SELECT * FROM admins WHERE username = ?', [username]);

      if (rows.length > 0) {
        const admin = rows[0];
        const isMatch = await bcrypt.compare(password, admin.password_hash);

        if (isMatch) {
          const token = generateToken({ id: admin.id, username: admin.username, role: admin.role });
          return res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { username: admin.username, role: admin.role },
          });
        }
      }
    }

    // Check in-memory fallback
    if (username === DEFAULT_ADMIN.username && bcrypt.compareSync(password, DEFAULT_ADMIN.passwordHash)) {
      const token = generateToken({ id: 1, username: 'admin', role: 'superadmin' });
      return res.json({
        success: true,
        message: 'Login successful (development mode)',
        token,
        user: { username: 'admin', role: 'superadmin' },
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

// GET /api/auth/me (check current login status)
router.get('/me', authenticateToken, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
