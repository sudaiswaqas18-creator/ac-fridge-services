import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Gallery, VideosSection } from '../components/Gallery.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

const WORK_SECTIONS = {
  gallery: { icon: I.zoom, ar: ['معرض الصور الميدانية', 'صور حقيقية من الورشة ومواقع الصيانة'], en: ['Field Photo Gallery', 'Real workshop and on-site maintenance photos'] },
  videos: { icon: I.play, ar: ['فيديوهات الصيانة الحية', 'شاهد فنيينا أثناء الفحص والإصلاح خطوة بخطوة'], en: ['Live Service Videos', 'Watch our technicians diagnose and repair step by step'] },
  transformations: { icon: I.sparkle, ar: ['نتائج قبل وبعد', 'قارن حالة الجهاز قبل الإصلاح وبعد استعادة كفاءته'], en: ['Before & After Results', 'Compare each unit before repair and after performance is restored'] },
};

export default function WorkDetailPage() {
  const { section } = useParams();
  const { isRTL } = useLanguage();
  const item = WORK_SECTIONS[section];
  if (!item) return <Navigate to="/portfolio" replace />;
  const [title, description] = isRTL ? item.ar : item.en;

  return (
    <div className="work-detail-page-view page-enter">
      <section className="subpage-hero-banner work-detail-hero">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <div className="service-breadcrumbs work-detail-breadcrumbs">
            <Link to="/portfolio">{isRTL ? 'أعمالنا' : 'Our Work'}</Link><span>/</span><span className="current-crumb">{title}</span>
          </div>
          <span className="subpage-hero-badge"><span className="badge-icon">{item.icon}</span>{isRTL ? 'تفاصيل أعمال جوزاء' : 'Jawzaa Work Details'}</span>
          <h1 className="subpage-hero-title">{title}</h1>
          <p className="subpage-hero-desc">{description}</p>
        </div>
      </section>
      {section === 'gallery' && <Gallery />}
      {section === 'videos' && <VideosSection />}
      {section === 'transformations' && <BeforeAfter expanded />}
    </div>
  );
}
