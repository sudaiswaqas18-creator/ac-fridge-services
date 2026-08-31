import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { getDbPool } from './config/database.js';

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
  'https://jawzaa-website-5pjihc70y-sudais18.vercel.app',
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

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directories
const publicDir = path.resolve('public');
const adminDir = path.resolve('public/admin');
const uploadDir = path.resolve('public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.static(publicDir));
app.use('/uploads', express.static(uploadDir));
app.use('/admin', express.static(adminDir));

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
    database: pool ? 'connected' : 'disconnected (mock mode)',
    time: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Serve admin SPA
app.get('/admin/*', (req, res) => {
  const adminIndex = path.join(adminDir, 'index.html');
  if (fs.existsSync(adminIndex)) {
    res.sendFile(adminIndex);
  } else {
    res.send('Admin panel loading...');
  }
});

// Initialize database tables on server start
async function initServer() {
  const pool = await getDbPool();
  if (pool) {
    try {
      const schemaPath = path.resolve('models/schema.sql');
      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        const statements = schemaSql
          .split(';')
          .map(s => s.trim())
          .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('USE'));

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
    console.log(`📊 Admin Panel URL: http://localhost:${PORT}/admin`);
    console.log(`🌐 API Endpoints available at http://localhost:${PORT}/api/`);
    console.log(`====================================================`);
  });
}

initServer();
