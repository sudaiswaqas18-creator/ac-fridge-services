import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import BrandLogo from './BrandLogo.jsx';

export function Footer() {
  const { isRTL } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const companyLinks = [
    { to: '/', label: isRTL ? 'الرئيسية' : 'Home' },
    { to: '/about', label: isRTL ? 'عن المؤسسة' : 'About Us' },
    { to: '/portfolio', label: isRTL ? 'سجل المشاريع' : 'Our Projects' },
    { to: '/reviews', label: isRTL ? 'آراء العملاء' : 'Reviews' },
    { to: '/blog', label: isRTL ? 'الدليل والمقالات' : 'Blog & Guides' },
    { to: '/careers', label: isRTL ? 'الوظائف' : 'Careers' },
  ];

  const serviceLinks = [
    { to: '/services/ac-repair', label: isRTL ? 'صيانة وإصلاح المكيفات' : 'AC & HVAC Services' },
    { to: '/services/ac-cleaning', label: isRTL ? 'غسيل وتنظيف المكيفات' : 'AC Jet Cleaning' },
    { to: '/services/central-hvac', label: isRTL ? 'التكييف المركزي والدكت' : 'Central & Ducted HVAC' },
    { to: '/services/refrigerator-repair', label: isRTL ? 'تصليح ثلاجات وفريزرات' : 'Refrigerators & Freezers' },
    { to: '/services/motor-rewinding', label: isRTL ? 'لف موتورات ومضخات' : 'Motor & Pump Rewinding' },
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* 4-Column Balanced Grid */}
        <div className="footer-grid">
          {/* Column 1: Brand */}
          <div className="footer-column footer-brand-col">
            <Link
              to="/"
              onClick={scrollToTop}
              className="footer-brand-logo-wrap"
              aria-label={isRTL ? BRAND.nameAr : BRAND.nameEn}
            >
              <BrandLogo dark tagline className="brand-lockup-footer" alt={isRTL ? BRAND.nameAr : BRAND.nameEn} />
            </Link>

            <p className="footer-description">
              {isRTL
                ? 'مؤسسة جوزاء للتبريد والتكييف — مركز هندسي معتمد لصيانة التكييف المركزي والسبليت، الثلاجات وغرف التبريد، ولف المحركات والمضخات بالرياض. سرعة استجابة ميدانية لجميع الأحياء، قطع غيار أصلية 100%، وضمان خطي معتمد على كافة أعمال الصيانة والإصلاح.'
                : 'Jawzaa Refrigeration & AC — Certified engineering repair center for residential and commercial HVAC, refrigerators, cold rooms, and motor rewinding across Riyadh. Fast mobile response to all districts, 100% genuine OEM parts, and official written warranty on all services.'}
            </p>

            <div className="footer-social">
              <a
                href="https://www.facebook.com/jawzaatabreedtakyeef"
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                className="social-link-btn"
              >
                {I.facebook}
              </a>
              <a
                href="https://www.instagram.com/jawzaatabreedtakyeef/"
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                className="social-link-btn"
              >
                {I.instagram}
              </a>
              <a
                href="https://www.tiktok.com/@jawzaatabreedtakyeef"
                target="_blank"
                rel="noopener"
                aria-label="TikTok"
                className="social-link-btn"
              >
                {I.tiktok}
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener"
                aria-label="WhatsApp"
                className="social-link-btn"
              >
                {I.whatsapp}
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="footer-column">
            <h4>{isRTL ? 'المؤسسة' : 'Company'}</h4>
            <ul>
              {companyLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} onClick={scrollToTop}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="footer-column">
            <h4>{isRTL ? 'خدماتنا' : 'Our Services'}</h4>
            <ul>
              {serviceLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.to} onClick={scrollToTop}>{link.label}</Link>
                </li>
              ))}
            </ul>
            <Link to="/services" onClick={scrollToTop} className="footer-more-link">
              <span>{isRTL ? 'دليل الخدمات الكامل' : 'View all services'}</span>
              <span className="footer-more-arrow" aria-hidden="true">{isRTL ? I.arrowL : I.arrowR}</span>
            </Link>
          </div>

          {/* Column 4: Contact */}
          <div className="footer-column">
            <h4>{isRTL ? 'تواصل معنا' : 'Contact Us'}</h4>
            <ul className="footer-contact-list">
              <li>
                <a href={`tel:${BRAND.phonePrimaryIntl}`} className="footer-contact-item">
                  <span className="footer-contact-icon">{I.phone}</span>
                  <span dir="ltr">{BRAND.phonePrimaryIntl}</span>
                </a>
              </li>
              <li>
                <a href={waLink()} target="_blank" rel="noopener" className="footer-contact-item">
                  <span className="footer-contact-icon">{I.whatsapp}</span>
                  <span>{isRTL ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
                </a>
              </li>
              <li>
                <span className="footer-contact-item">
                  <span className="footer-contact-icon">{I.clock}</span>
                  <span>{isRTL ? BRAND.hoursAr : BRAND.hoursEn}</span>
                </span>
              </li>
              <li>
                <a href={BRAND.mapUrl} target="_blank" rel="noopener noreferrer" className="footer-contact-item">
                  <span className="footer-contact-icon">{I.pin}</span>
                  <span>{isRTL ? BRAND.cityAr : BRAND.cityEn}</span>
                </a>
              </li>
            </ul>

            <Link to="/contact" onClick={scrollToTop} className="footer-cta-btn">
              {isRTL ? 'احجز فنّي صيانة' : 'Book a Technician'}
            </Link>
          </div>
        </div>

        {/* Local SEO Text */}
        <div className="footer-seo-bar">
          <p>
            {isRTL
              ? 'صيانة المكيفات والثلاجات والفريزرات ولف المحركات والمضخات في جميع أحياء الرياض. مواعيد واضحة وخدمة متقنة وضمان خطي.'
              : 'AC and refrigeration care, motor and pump rewinding across Riyadh. Clear appointments, careful workmanship and written warranties.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {isRTL ? BRAND.nameAr : BRAND.nameEn}. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <a className="footer-credit" href="https://www.facebook.com/AfyraDigital" target="_blank" rel="noopener noreferrer">Developed by Afyra Digital</a>
          <div className="footer-bottom-links">
            <Link to="/faq" onClick={scrollToTop}>{isRTL ? 'الأسئلة الشائعة' : 'FAQs'}</Link>
            <Link to="/privacy" onClick={scrollToTop}>{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
            <Link to="/terms" onClick={scrollToTop}>{isRTL ? 'الشروط والأحكام' : 'Terms of Service'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FloatActions() {
  const { lang, isRTL } = useLanguage();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="floating-quick-actions">
        <a
          className="float-action-btn wa-float-btn"
          href={waLink(isRTL ? 'السلام عليكم، أرغب بطلب فني صيانة فوري من جوزاء' : 'Hello, I need an urgent technician from Jawzaa')}
          target="_blank"
          rel="noopener"
          aria-label="WhatsApp Chat"
        >
          {I.whatsapp}
          <span className="float-btn-tooltip">
            {isRTL ? 'راسلنا واتساب — رد فوري' : 'WhatsApp — Instant Reply'}
          </span>
        </a>

        <a
          className="float-action-btn call-float-btn"
          href={`tel:${BRAND.phonePrimaryIntl}`}
          aria-label="Direct Phone Call"
        >
          {I.phone}
          <span className="float-btn-tooltip">
            <span dir="ltr">{BRAND.phonePrimary}</span>
          </span>
        </a>
      </div>

      <button
        className={`scroll-to-top-btn ${showTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        {I.up}
      </button>
    </>
  );
}
