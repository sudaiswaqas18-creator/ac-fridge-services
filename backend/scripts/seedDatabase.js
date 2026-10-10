import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'jawzaa_db',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  multipleStatements: true,
};

async function seed() {
  console.log(`[Seed] Connecting to MySQL at ${DB_CONFIG.host}:${DB_CONFIG.port}...`);

  // Step 1: Ensure database exists
  const rootConn = await mysql.createConnection({
    host: DB_CONFIG.host,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    port: DB_CONFIG.port,
  });

  await rootConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`[Seed] Database '${DB_CONFIG.database}' verified/created.`);
  await rootConn.end();

  // Step 2: Connect to the database
  const conn = await mysql.createConnection({
    ...DB_CONFIG,
  });

  // Step 3: Run schema.sql
  const schemaPath = path.resolve('models/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    const cleanSql = schemaSql.replace(/--.*$/gm, '');
    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.toLowerCase().startsWith('use ') && !s.toLowerCase().startsWith('create database '));

    for (const stmt of statements) {
      try {
        await conn.query(stmt);
      } catch (err) {
        console.error(`[Seed Schema Error on statement]`, stmt.substring(0, 50), err.message);
      }
    }
    console.log(`[Seed] Schema tables created successfully.`);
  }

  // Step 4: Seed Admin user
  const adminHash = bcrypt.hashSync('admin123', 10);
  await conn.query(
    `INSERT INTO admins (username, email, password_hash, role)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    ['admin', 'admin@jawzaa-hvac.sa', adminHash, 'superadmin']
  );
  console.log(`[Seed] Admin user seeded (username: admin, password: admin123).`);

  // Step 5: Read store.json and populate MySQL
  const storePath = path.resolve('data/store.json');
  if (fs.existsSync(storePath)) {
    const raw = fs.readFileSync(storePath, 'utf8');
    const store = JSON.parse(raw);

    // 5.1 Services
    if (Array.isArray(store.services)) {
      for (const [idx, s] of store.services.entries()) {
        await conn.query(
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
            s.slug,
            s.icon || 'tools',
            s.heroImage || '',
            s.titleAr || '',
            s.titleEn || '',
            s.subtitleAr || '',
            s.subtitleEn || '',
            s.overviewAr || '',
            s.overviewEn || '',
            JSON.stringify(s.symptomsAddressedAr || []),
            JSON.stringify(s.symptomsAddressedEn || []),
            JSON.stringify(s.processStepsAr || []),
            JSON.stringify(s.processStepsEn || []),
            JSON.stringify(s.pricingTiers || []),
            JSON.stringify(s.stats || []),
            JSON.stringify(s.faqs || []),
            idx,
          ]
        );
      }
      console.log(`[Seed] Seeded ${store.services.length} services into MySQL.`);
    }

    // 5.2 Reviews / Testimonials
    if (Array.isArray(store.reviews)) {
      for (const [idx, r] of store.reviews.entries()) {
        await conn.query(
          `INSERT INTO testimonials 
           (name_ar, name_en, area_ar, area_en, service_ar, service_en, text_ar, text_en, rating, date_str, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            r.nameAr || '',
            r.nameEn || '',
            r.areaAr || '',
            r.areaEn || '',
            r.serviceAr || '',
            r.serviceEn || '',
            r.textAr || '',
            r.textEn || '',
            Number(r.rating || 5),
            r.date || '2026',
            idx,
          ]
        );
      }
      console.log(`[Seed] Seeded ${store.reviews.length} testimonials into MySQL.`);
    }

    // 5.3 Inquiries / Bookings
    if (Array.isArray(store.inquiries)) {
      for (const inq of store.inquiries) {
        await conn.query(
          `INSERT INTO contact_inquiries (name, phone, area, service, notes, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [inq.name || '', inq.phone || '', inq.area || '', inq.service || '', inq.notes || '', inq.status || 'new']
        );
      }
      console.log(`[Seed] Seeded ${store.inquiries.length} contact inquiries into MySQL.`);
    }

    // 5.4 Case Studies
    if (Array.isArray(store.cases)) {
      for (const [idx, c] of store.cases.entries()) {
        await conn.query(
          `INSERT INTO case_studies (case_key, title_ar, title_en, category_ar, category_en, challenge_ar, challenge_en, solution_ar, solution_en, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title_ar = VALUES(title_ar), title_en = VALUES(title_en)`,
          [
            c.id || `case-${idx}`,
            c.titleAr || '',
            c.titleEn || '',
            c.categoryAr || '',
            c.categoryEn || '',
            c.challengeAr || '',
            c.challengeEn || '',
            c.solutionAr || '',
            c.solutionEn || '',
            idx,
          ]
        );
      }
      console.log(`[Seed] Seeded ${store.cases.length} case studies into MySQL.`);
    }

    // 5.5 Blog Posts
    if (Array.isArray(store.posts)) {
      for (const p of store.posts) {
        await conn.query(
          `INSERT INTO blog_posts (slug, title_ar, title_en, category_ar, category_en, excerpt_ar, excerpt_en, read_time_ar, read_time_en)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title_ar = VALUES(title_ar), title_en = VALUES(title_en)`,
          [
            p.slug || `post-${Date.now()}`,
            p.titleAr || '',
            p.titleEn || '',
            p.categoryAr || '',
            p.categoryEn || '',
            p.excerptAr || '',
            p.excerptEn || '',
            p.readTimeAr || '5 دقائق',
            p.readTimeEn || '5 min read',
          ]
        );
      }
      console.log(`[Seed] Seeded ${store.posts.length} blog posts into MySQL.`);
    }

    // 5.6 Industries
    if (Array.isArray(store.industries)) {
      for (const [idx, ind] of store.industries.entries()) {
        await conn.query(
          `INSERT INTO industries (industry_key, icon, title_ar, title_en, desc_ar, desc_en, features_ar, features_en, display_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title_ar = VALUES(title_ar), title_en = VALUES(title_en)`,
          [
            ind.id || `ind-${idx}`,
            ind.icon || 'bolt',
            ind.titleAr || '',
            ind.titleEn || '',
            ind.descAr || '',
            ind.descEn || '',
            JSON.stringify(ind.featuresAr || []),
            JSON.stringify(ind.featuresEn || []),
            idx,
          ]
        );
      }
      console.log(`[Seed] Seeded ${store.industries.length} industries into MySQL.`);
    }

    // 5.7 FAQs
    if (Array.isArray(store.faqs)) {
      for (const [idx, f] of store.faqs.entries()) {
        await conn.query(
          `INSERT INTO faqs (q_ar, q_en, a_ar, a_en, display_order)
           VALUES (?, ?, ?, ?, ?)`,
          [f.qAr || '', f.qEn || '', f.aAr || '', f.aEn || '', idx]
        );
      }
      console.log(`[Seed] Seeded ${store.faqs.length} FAQs into MySQL.`);
    }
  }

  await conn.end();
  console.log(`[Seed] Completed successfully! MySQL database is fully populated and ready.`);
}

seed().catch(err => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
