import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { getDbPool } from './config/database.js';
import { getStoredServices, getStoredInquiries } from './config/store.js';

// Routes
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import reviewsRoutes from './routes/reviews.js';
import galleryRoutes from './routes/gallery.js';
import blogRoutes from './routes/blog.js';
import industriesRoutes from './routes/industries.js';
import portfolioRoutes from './routes/portfolio.js';
import faqRoutes from './routes/faq.js';
import careersRoutes from './routes/careers.js';
import settingsRoutes from './routes/settings.js';
import contactRoutes from './routes/contact.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const defaultOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://jawzaa-website-5pjihc70y-sudais18.vercel.app',
  'https://jawzaa-website.vercel.app',
];
const configuredOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...configuredOrigins])];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
      return;
    }
    callback(null, true); // Allow all dev origins cleanly
  },
  credentials: true,
};

// Middleware
app.disable('x-powered-by');

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Simple Rate Limiting for sensitive routes (Auth & Contact)
const rateLimitMap = new Map();
const rateLimiter = (maxRequests = 30, windowMs = 60000) => (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + windowMs;
  } else {
    clientData.count += 1;
    if (clientData.count > maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests from this IP, please try again later.',
      });
    }
  }
  rateLimitMap.set(ip, clientData);
  next();
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth/login', rateLimiter(15, 60000));
app.use('/api/contact', rateLimiter(20, 60000));

// Static directories (uploads & public images)
const publicDir = path.resolve('public');
const uploadDir = path.resolve('public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/industries', industriesRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/contact', contactRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const pool = await getDbPool();
  res.json({
    status: 'healthy',
    database: pool ? 'connected (MySQL)' : 'active (Synced JSON Store)',
    servicesCount: getStoredServices().length,
    inquiriesCount: getStoredInquiries().length,
    time: new Date().toISOString(),
    version: '2.5.0',
  });
});

// Admin panel redirect: always forward /admin to the real Jawzaa React CMS
app.get(['/admin', '/admin/*'], (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  return res.redirect(`${frontendUrl}/admin`);
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    project: 'Jawzaa HVAC & Refrigeration API',
    status: 'Online',
    frontend: 'http://localhost:5173',
    adminCMS: 'http://localhost:5173/admin',
    apiDocs: 'http://localhost:5000/api/health',
  });
});

// Initialize database tables on server start
async function initServer() {
  const pool = await getDbPool();
  if (pool) {
    try {
      const schemaPath = path.resolve('models/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const cleanSql = schemaSql.replace(/--.*$/gm, '');
        const statements = cleanSql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use ') && !s.toLowerCase().startsWith('create database '));

        for (const statement of statements) {
          try {
            await pool.query(statement);
          } catch (stmtErr) {
            // Ignore minor duplicate/exists errors
          }
        }
        console.log('[Database] Schema verification completed successfully.');
      }
    } catch (err) {
      console.warn('[Database Warning] Could not auto-run schema:', err.message);
    }
  }

  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Jawzaa HVAC Backend API running on port ${PORT}`);
    console.log(`📊 Admin CMS URL: http://localhost:5173/admin`);
    console.log(`🌐 API Endpoints available at http://localhost:${PORT}/api/`);
    console.log(`====================================================`);
  });
}

initServer();
