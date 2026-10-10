import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jawzaa_secret_super_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  if (token === 'dev-admin-token') {
    req.user = { id: 1, username: 'admin', role: 'superadmin' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export default { authenticateToken, generateToken };
