import React from 'react';
import { Gallery, VideosSection, Process } from '../components/Gallery.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import { Posters } from '../components/Reviews.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

export default function GalleryPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="gallery-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.zoom}</span>
            {isRTL ? 'معرض الأعمال والورشة' : 'Our Work & Workshop'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'أعمالنا وفيديوهات الصيانة في الرياض' : 'Our Real Works & Service Videos in Riyadh'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'شاهد صور وفيديوهات حقيقية من ورشتنا ومعارضنا أثناء فحص وإصلاح المكيفات والثلاجات ولف الموتورات.'
              : 'Explore authentic photos and video footage from our workshop and service sites during HVAC and appliance repair.'}
          </p>
        </div>
      </section>

      <Gallery />
      <VideosSection />
      <BeforeAfter />
      <Posters />
      <Process />
    </div>
  );
}
