import React, { useEffect, useState, useRef } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { NAV_STRUCTURE } from '../content/siteData.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import BrandLogo from './BrandLogo.jsx';

const ICONS_MAP = {
  ac: I.ac,
  snow: I.snow,
  tools: I.tools,
  fridge: I.fridge,
  washer: I.washer,
  motor: I.motor,
  diagnosis: I.diagnosis,
  contract: I.contract,
  home: I.home,
  bolt: I.bolt,
  zoom: I.zoom,
  check: I.check,
  play: I.play,
  sparkle: I.sparkle,
  shield: I.shield,
  star: I.star,
  userCheck: I.userCheck,
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileAccordion, setMobileAccordion] = useState(null);
  const location = useLocation();
  const { lang, toggleLang, isRTL } = useLanguage();
  const navItems = NAV_STRUCTURE[lang] || NAV_STRUCTURE.ar;
  const dropdownTimeoutRef = useRef(null);

  // A dropdown can represent several routes (for example, "Solutions" opens
  // /industries and "Company" opens /about, /reviews, and more). Match its
  // actual link targets instead of its display id so the current location is
  // always visibly indicated in the navigation.
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
    setMobileAccordion(null);
  }, [location.pathname, location.hash]);

  const handleMouseEnter = id => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(id);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      <div className="site-header-master">
        {/* Ultra Clean Topbar */}
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
                <span>{isRTL ? 'خدمة طوارئ في جميع أحياء الرياض' : 'Same-Day Dispatch Across Riyadh'}</span>
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

        {/* Main Sticky Glassmorphism Header */}
        <header className={`main-navbar-sticky ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="container navbar-content">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand" aria-label={isRTL ? BRAND.nameAr : BRAND.nameEn}>
            <BrandLogo dark tagline className="brand-lockup-header" alt={isRTL ? BRAND.nameAr : BRAND.nameEn} />
          </Link>

          {/* Center Navigation with Mega Dropdowns */}
          <nav className="navbar-nav-center" aria-label="Main Navigation">
            {navItems.map(item => {
              if (item.isDropdown) {
                const isOpen = activeDropdown === item.id;
                const isMega = item.items.length > 4;
                const isCurrentActive = isDropdownCurrent(item);

                return (
                  <div
                    key={item.id}
                    className={`nav-dropdown-wrapper ${isOpen ? 'dropdown-active' : ''} ${isCurrentActive ? 'has-current-page' : ''}`}
                    onMouseEnter={() => handleMouseEnter(item.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`nav-item-btn ${isCurrentActive ? 'is-current-active' : ''}`}
                      onClick={() => setActiveDropdown(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.label}</span>
                      <span className={`dropdown-arrow ${isOpen ? 'arrow-rotated' : ''}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {/* Dropdown Menu Container */}
                    <div className={`nav-dropdown-menu ${isMega ? 'mega-dropdown-menu' : ''} ${isOpen ? 'menu-visible' : ''}`}>
                      <div className="dropdown-grid-layout">
                        {item.items.map(subItem => (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            className="dropdown-item-card"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="item-icon-box">
                              {ICONS_MAP[subItem.icon] || I.tools}
                            </div>
                            <div className="item-text-body">
                              <div className="item-title-row">
                                <span className="item-title">{subItem.title}</span>
                                {subItem.badge && <span className="item-badge">{subItem.badge}</span>}
                              </div>
                              <p className="item-description">{subItem.desc}</p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {item.footerLink && (
                        <div className="dropdown-footer-bar">
                          <Link
                            to={item.footerLink.path}
                            className="dropdown-footer-cta"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <span>{item.footerLink.label}</span>
                          </Link>
                        </div>
                      )}
                    </div>
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
            >
              <span className="line l1" />
              <span className="line l2" />
              <span className="line l3" />
            </button>
          </div>
        </div>
      </header>
    </div>

      {/* Mobile Drawer Navigation with Accordions */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'drawer-open' : ''}`}>
        <div className="drawer-overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="drawer-panel">
          <div className="drawer-header">
            <div className="drawer-brand">
              <BrandLogo dark alt={isRTL ? BRAND.nameAr : BRAND.nameEn} className="brand-lockup-drawer" />
            </div>
            <button
              className="drawer-close-btn"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              {I.close}
            </button>
          </div>

          <div className="drawer-menu-content">
            {navItems.map(item => {
              if (item.isDropdown) {
                const isAccordionOpen = mobileAccordion === item.id;
                const isCurrentActive = isDropdownCurrent(item);
                return (
                  <div key={item.id} className="drawer-accordion-group">
                    <button
                      className={`drawer-accordion-trigger ${isAccordionOpen ? 'expanded' : ''} ${isCurrentActive ? 'is-current-active' : ''}`}
                      onClick={() => setMobileAccordion(isAccordionOpen ? null : item.id)}
                    >
                      <span>{item.label}</span>
                      <span className="accordion-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    <div className={`drawer-accordion-body ${isAccordionOpen ? 'body-expanded' : ''}`}>
                      {item.items.map(subItem => (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className="drawer-sub-link"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <span className="sub-link-icon">{ICONS_MAP[subItem.icon] || I.tools}</span>
                          <span className="sub-link-title">{subItem.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className="drawer-direct-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          <div className="drawer-footer">
            <button className="drawer-lang-btn" onClick={toggleLang}>
              <span className="btn-icon">{I.globe}</span>
              <span>{isRTL ? 'Switch to English' : 'التحويل إلى العربية'}</span>
            </button>

            <a
              className="btn btn-wa drawer-wa-btn"
              href={waLink()}
              target="_blank"
              rel="noopener"
            >
              {I.whatsapp} {isRTL ? 'حجز فوري عبر واتساب' : 'Instant WhatsApp Booking'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
