import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { NAV_STRUCTURE } from '../content/siteData.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import { SERVICE_IMAGES } from '../content/serviceImages.js';
import BrandLogo from './BrandLogo.jsx';

// Dynamic Preview Images
import acImg from '../assets/media/poster-before-after-ac.webp';
import jetCleanImg from '../assets/media/poster-ac-jet-cleaning.webp';
import centralImg from '../assets/media/poster-commercial-hvac-maintenance.webp';
import fridgeImg from '../assets/media/poster-before-after-fridge.webp';
import motorImg from '../assets/media/poster-before-after-motor.webp';
import diagImg from '../assets/media/poster-correct-diagnosis.webp';
import contractImg from '../assets/media/ac-outdoor-units-stack.webp';

import galleryImg from '../assets/media/jawzaa-storefront-day.webp';
import casesImg from '../assets/media/poster-services-list.webp';
import videoImg from '../assets/media/poster-inside-workshop.webp';
import transformImg from '../assets/media/poster-before-after-motor.webp';

import aboutImg from '../assets/media/jawzaa-storefront-open.webp';
import reviewsImg from '../assets/media/poster-correct-diagnosis.webp';
import blogImg from '../assets/media/poster-summer-maintenance.webp';
import faqImg from '../assets/media/poster-4-warning-signs.webp';
import careersImg from '../assets/media/workshop-technician-wide.webp';

const PREVIEW_IMAGE_MAP = {
  'ac-repair': acImg,
  'ac-cleaning': jetCleanImg,
  'central-hvac': centralImg,
  'refrigerator-repair': fridgeImg,
  'motor-rewinding': motorImg,
  'fault-diagnostics': diagImg,
  'maintenance-contracts': contractImg,

  'showcase': galleryImg,
  'case-studies': casesImg,
  'videos-vault': videoImg,
  'before-after': transformImg,

  'about': aboutImg,
  'reviews': reviewsImg,
  'blog': blogImg,
  'faq': faqImg,
  'careers': careersImg,
  ...SERVICE_IMAGES,
};


export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredSubItem, setHoveredSubItem] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const location = useLocation();
  const { lang, toggleLang, isRTL } = useLanguage();
  const navItems = NAV_STRUCTURE[lang] || NAV_STRUCTURE.ar;
  const dropdownTimeoutRef = useRef(null);

  const isDropdownCurrent = item => {
    const paths = [item.path, item.footerLink?.path, ...(item.items || []).map(sub => sub.path)]
      .filter(Boolean)
      .map(path => path.split('#')[0]);

    return paths.some(path =>
      path === '/' ? location.pathname === '/' : location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setHoveredSubItem(null);
    setMobileAccordion(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleMouseEnter = (id, items) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
    if (items && items.length > 0 && (!hoveredSubItem || !items.some(i => i.id === hoveredSubItem.id))) {
      setHoveredSubItem(items[0]);
    }
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
      setHoveredSubItem(null);
    }, 200);
  };

  return (
    <>
      <div className="site-header-master">
        {/* Topbar */}
        <div className="header-topbar">
          <div className="container topbar-container">
            <div className="topbar-left">
              <a className="topbar-phone-link" href={`tel:${BRAND.phonePrimaryIntl}`}>
                <span className="phone-icon-wrap">{I.phone}</span>
                <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>
              <span className="topbar-divider">|</span>
              <span className="topbar-hours">
                <span className="clock-icon-wrap">{I.clock}</span>
                <span>{isRTL ? BRAND.hoursAr : BRAND.hoursEn}</span>
              </span>
            </div>

            <div className="topbar-right">
              <div className="topbar-status-pill">
                <span className="status-dot-green" />
                <span>{isRTL ? 'خدمة طوارئ في جميع أحياء الرياض' : 'Same-Day Service Across Riyadh'}</span>
              </div>

              <button
                className="topbar-lang-btn"
                onClick={toggleLang}
                aria-label="Toggle Language"
                title={isRTL ? 'Switch to English' : 'التحويل إلى العربية'}
              >
                <span className="globe-icon-wrap">{I.globe}</span>
                <span>{isRTL ? 'English' : 'العربية'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Sticky Header */}
        <header className={`main-navbar-sticky ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="container navbar-content">
            {/* Brand Logo */}
            <Link to="/" className="navbar-brand" aria-label={isRTL ? BRAND.nameAr : BRAND.nameEn}>
              <BrandLogo dark tagline className="brand-lockup-header" alt={isRTL ? BRAND.nameAr : BRAND.nameEn} />
            </Link>

            {/* Center Navigation with Full-Width Mega Menus */}
            <nav className="navbar-nav-center" aria-label="Main Navigation">
              {navItems.map(item => {
                if (item.isDropdown) {
                  const isOpen = activeDropdown === item.id;
                  const isCurrentActive = isDropdownCurrent(item);
                  const currentPreviewItem = hoveredSubItem || item.items[0];
                  const currentImgSrc = currentPreviewItem
                    ? PREVIEW_IMAGE_MAP[currentPreviewItem.id] || acImg
                    : acImg;

                  return (
                    <div
                      key={item.id}
                      className={`nav-dropdown-wrapper ${isOpen ? 'dropdown-active' : ''} ${isCurrentActive ? 'has-current-page' : ''}`}
                      onMouseEnter={() => handleMouseEnter(item.id, item.items)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Clickable Nav Link (Task 2: Navigates to page on click) */}
                      <div className="nav-dropdown-trigger-group">
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `nav-item-btn-link ${isActive || isCurrentActive ? 'is-current-active' : ''}`
                          }
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span>{item.label}</span>
                        </NavLink>
                        <button
                          type="button"
                          className="dropdown-arrow-toggle"
                          aria-label={`Toggle ${item.label} menu`}
                          aria-expanded={isOpen}
                          onClick={e => {
                            e.stopPropagation();
                            if (isOpen) {
                              setActiveDropdown(null);
                            } else {
                              handleMouseEnter(item.id, item.items);
                            }
                          }}
                        >
                          <span className={`dropdown-arrow ${isOpen ? 'arrow-rotated' : ''}`}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </button>
                      </div>

                      {/* Full-Width Mega Menu (Task 3: Spans complete screen width with dynamic preview) */}
                      {(
                        <div
                          className={`mega-menu-fullwidth-wrapper ${isOpen ? 'is-open' : ''}`}
                          aria-hidden={!isOpen}
                          inert={!isOpen || undefined}
                          onMouseEnter={() => handleMouseEnter(item.id, item.items)}
                        >
                          <div className="mega-menu-inner-container">
                            {/* Main Items Grid */}
                            <div className="mega-menu-links-col">
                              <div className="mega-menu-header-bar">
                                <span className="mega-menu-section-label">
                                  {isRTL ? `أقسام وتخصصات ${item.label}` : `Explore ${item.label}`}
                                </span>
                                <Link
                                  to={item.path}
                                  className="mega-menu-view-all-link"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span>{isRTL ? 'عرض الصفحة الرئيسية للقسم' : 'View Section Page'} {isRTL ? I.arrowL : I.arrowR}</span>
                                </Link>
                              </div>

                              <div className="mega-menu-cards-grid">
                                {item.items.map(subItem => {
                                  const isHovered = currentPreviewItem?.id === subItem.id;
                                  return (
                                    <Link
                                      key={subItem.id}
                                      to={subItem.path}
                                      className={`mega-menu-item-row ${isHovered ? 'active-hover' : ''}`}
                                      onMouseEnter={() => setHoveredSubItem(subItem)}
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <div className="mega-item-thumbnail"><img src={PREVIEW_IMAGE_MAP[subItem.id] || acImg} alt="" width="72" height="54" loading="lazy" decoding="async" /></div>
                                      <div className="mega-item-content">
                                        <div className="mega-item-title-wrap">
                                          <span className="mega-item-title">{subItem.title}</span>
                                          {subItem.badge && <span className="mega-item-badge">{subItem.badge}</span>}
                                        </div>
                                        <p className="mega-item-desc">{subItem.desc}</p>
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Dynamic Live Preview Panel (Task 3: Changes on hover) */}
                            <div className="mega-menu-preview-col">
                              {currentPreviewItem && (
                                <div className="mega-preview-card">
                                  <div className="mega-preview-image-wrap">
                                    <img
                                      src={currentImgSrc}
                                      alt={currentPreviewItem.title}
                                      className="mega-preview-img"
                                    />
                                    <span className="mega-preview-badge">
                                      {isRTL ? 'معاينة فورية' : 'Live Preview'}
                                    </span>
                                  </div>
                                  <div className="mega-preview-body">
                                    <h4 className="mega-preview-title">{currentPreviewItem.title}</h4>
                                    <p className="mega-preview-desc">{currentPreviewItem.desc}</p>
                                    <Link
                                      to={currentPreviewItem.path}
                                      className="btn btn-gold btn-mega-preview-cta"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <span>{isRTL ? 'فتح التفاصيل والأسعار' : 'Explore Details & Pricing'}</span>
                                      <span>{isRTL ? I.arrowL : I.arrowR}</span>
                                    </Link>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `nav-link-direct ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* Right Action CTA Button */}
            <div className="navbar-actions-right">
              <a
                className="btn btn-gold header-booking-cta"
                href={waLink(isRTL ? 'السلام عليكم، أرغب بطلب فني صيانة فوري من جوزاء' : 'Hello, I want to book a technician from Jawzaa')}
                target="_blank"
                rel="noopener"
              >
                <span className="btn-icon">{I.whatsapp}</span>
                <span>{isRTL ? 'احجز فنّي الآن' : 'Book Technician'}</span>
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                className={`mobile-hamburger-btn ${mobileMenuOpen ? 'is-active' : ''}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className="line l1" />
                <span className="line l2" />
                <span className="line l3" />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-shell" onClick={e => e.stopPropagation()} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="mobile-drawer-header">
              <BrandLogo dark tagline={false} className="mobile-drawer-logo" />
              <button
                className="mobile-drawer-close"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                {I.close}
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              {navItems.map(item => {
                if (item.isDropdown) {
                  const isAccOpen = mobileAccordion === item.id;
                  return (
                    <div key={item.id} className="mobile-accordion-group">
                      <div className="mobile-accordion-header-row">
                        <Link
                          to={item.path}
                          className="mobile-accordion-direct-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <button
                          type="button"
                          className="mobile-accordion-toggle-btn"
                          aria-label={item.label}
                          aria-expanded={isAccOpen}
                          onClick={() => setMobileAccordion(isAccOpen ? null : item.id)}
                        >
                          <span className={`mobile-chevron ${isAccOpen ? "is-open" : ""}`}>{I.arrow}</span>
                        </button>
                      </div>

                      {isAccOpen && (
                        <div className="mobile-accordion-sublinks">
                          {item.items.map(subItem => (
                            <Link
                              key={subItem.id}
                              to={subItem.path}
                              className="mobile-sublink-item"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span className="mega-item-thumbnail"><img src={PREVIEW_IMAGE_MAP[subItem.id] || acImg} alt="" width="72" height="54" loading="lazy" decoding="async" /></span>
                              <span className="sublink-title">{subItem.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className="mobile-nav-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>

            <div className="mobile-drawer-footer">
              <a
                className="btn btn-gold mobile-drawer-cta"
                href={waLink(isRTL ? 'السلام عليكم، أحتاج فني صيانة عاجل' : 'Hello, I need an urgent technician')}
                target="_blank"
                rel="noopener"
              >
                <span>{I.whatsapp}</span>
                <span>{isRTL ? 'حجز فوري عبر واتساب' : 'Book via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
