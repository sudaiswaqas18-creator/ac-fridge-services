import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

const ITEMS = [
  { to: '/about', icon: I.shield, ar: 'عن جوزاء', en: 'About Jawzaa' },
  { to: '/reviews', icon: I.star, ar: 'آراء العملاء', en: 'Customer Reviews' },
  { to: '/blog', icon: I.snow, ar: 'دليل الصيانة', en: 'Maintenance Guides' },
  { to: '/faq', icon: I.diagnosis, ar: 'الأسئلة الشائعة', en: 'FAQs' },
  { to: '/careers', icon: I.userCheck, ar: 'الوظائف والفريق', en: 'Careers & Team' },
];

export default function CompanySectionNav() {
  const { isRTL } = useLanguage();
  const { pathname } = useLocation();
  return (
    <nav className="company-section-nav" aria-label={isRTL ? 'أقسام المؤسسة' : 'Company sections'}>
      {ITEMS.map(item => (
        <Link key={item.to} to={item.to} className={pathname === item.to ? 'active' : ''}>
          <span>{item.icon}</span><span>{isRTL ? item.ar : item.en}</span>
        </Link>
      ))}
    </nav>
  );
}
