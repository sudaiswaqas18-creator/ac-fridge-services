-- Jawzaa HVAC Database Schema

CREATE DATABASE IF NOT EXISTS jawzaa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jawzaa_db;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Services Table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'tools',
  hero_image VARCHAR(255) DEFAULT '',
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  subtitle_ar TEXT,
  subtitle_en TEXT,
  overview_ar TEXT,
  overview_en TEXT,
  symptoms_ar JSON,
  symptoms_en JSON,
  process_steps_ar JSON,
  process_steps_en JSON,
  pricing_tiers JSON,
  stats JSON,
  faqs JSON,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Reviews / Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  area_ar VARCHAR(150),
  area_en VARCHAR(150),
  service_ar VARCHAR(200),
  service_en VARCHAR(200),
  text_ar TEXT NOT NULL,
  text_en TEXT NOT NULL,
  rating INT DEFAULT 5,
  date_str VARCHAR(50) DEFAULT '2026',
  is_verified BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Gallery Items Table
CREATE TABLE IF NOT EXISTS gallery_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_key VARCHAR(100) NOT NULL,
  src VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Video Items Table
CREATE TABLE IF NOT EXISTS video_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  video_key VARCHAR(100) NOT NULL,
  src VARCHAR(255) NOT NULL,
  poster VARCHAR(255) DEFAULT '',
  duration VARCHAR(20) DEFAULT '0:30',
  category_ar VARCHAR(100),
  category_en VARCHAR(100),
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(150) NOT NULL UNIQUE,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  category_ar VARCHAR(100),
  category_en VARCHAR(100),
  excerpt_ar TEXT,
  excerpt_en TEXT,
  content_ar LONGTEXT,
  content_en LONGTEXT,
  image VARCHAR(255) DEFAULT '',
  read_time_ar VARCHAR(50) DEFAULT '5 دقائق',
  read_time_en VARCHAR(50) DEFAULT '5 min read',
  published_at DATE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Case Studies / Portfolio Table
CREATE TABLE IF NOT EXISTS case_studies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  case_key VARCHAR(150) NOT NULL UNIQUE,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  category_ar VARCHAR(100),
  category_en VARCHAR(100),
  client_ar VARCHAR(200),
  client_en VARCHAR(200),
  date_str VARCHAR(50) DEFAULT '2026',
  image VARCHAR(255) DEFAULT '',
  metrics JSON,
  challenge_ar TEXT,
  challenge_en TEXT,
  solution_ar TEXT,
  solution_en TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Industries Table
CREATE TABLE IF NOT EXISTS industries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  industry_key VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50) DEFAULT 'bolt',
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  desc_ar TEXT,
  desc_en TEXT,
  features_ar JSON,
  features_en JSON,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. General FAQs Table
CREATE TABLE IF NOT EXISTS faqs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  q_ar TEXT NOT NULL,
  q_en TEXT NOT NULL,
  a_ar TEXT NOT NULL,
  a_en TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Careers Table
CREATE TABLE IF NOT EXISTS careers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  career_key VARCHAR(100) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  type_ar VARCHAR(100),
  type_en VARCHAR(100),
  experience_ar VARCHAR(200),
  experience_en VARCHAR(200),
  desc_ar TEXT,
  desc_en TEXT,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Contact Inquiries/Bookings Table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  area VARCHAR(150) DEFAULT '',
  service VARCHAR(255) NOT NULL,
  notes TEXT DEFAULT '',
  status VARCHAR(30) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Site Settings Table (Key-Value)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
