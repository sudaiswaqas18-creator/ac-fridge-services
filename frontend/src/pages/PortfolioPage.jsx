import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GALLERY_ITEMS, CASE_STUDIES, VIDEO_ITEMS } from '../content/siteData.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import { localizedValue } from '../localizedValue.js';

const mediaGlob = import.meta.glob(['../assets/media/*.webp'], { eager: true, import: 'default' });
const getMediaUrl = name =>
  mediaGlob[`../assets/media/${name}.webp`] ||
  mediaGlob[`../assets/media/${name}`] ||
  name;

export default function PortfolioPage() {
  const { isRTL } = useLanguage();
  const { cases, gallery } = useData();
  const [filterCat, setFilterCat] = useState('all');
  const [lightboxImg, setLightboxImg] = useState(null);

  const filteredPhotos = filterCat === 'all'
    ? gallery
    : gallery.filter(item => item.category === filterCat);

  return (
    <div className="portfolio-page-view">
      {/* Hero Banner with Detailed Workshop Background */}
      <section className="subpage-hero-banner portfolio-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.zoom}</span>
            {isRTL ? 'معرض الأعمال والمشاريع الميدانية' : 'Field Projects & Work Portfolio'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'أعمالنا الموثقة ودراسات الحالة بالرياض' : 'Documented Works & Proven Case Studies'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'تصفح صوراً وفيديوهات حقيقية من ورشتنا ومشاريع الصيانة المنفذة في مختلف أحياء الرياض مع نتائج موثقة.'
              : 'Explore genuine photos, live service footage, and documented case studies completed across Riyadh.'}
          </p>
        </div>
      </section>

      <section className="content-hub-section portfolio-hub-section">
        <div className="container">
          <div className="content-hub-grid">
            {[
              { to: '/portfolio#cases', icon: I.check, title: isRTL ? 'دراسات الحالة' : 'Case Studies', desc: isRTL ? 'مشاريع موثقة بالتحديات والنتائج والأرقام.' : 'Documented projects with challenges, outcomes, and metrics.' },
              { to: '/work/gallery', icon: I.zoom, title: isRTL ? 'معرض الصور' : 'Photo Gallery', desc: isRTL ? 'لقطات حقيقية من الورشة ومواقع العمل.' : 'Authentic snapshots from our workshop and field work.' },
              { to: '/work/videos', icon: I.play, title: isRTL ? 'فيديوهات الصيانة' : 'Service Videos', desc: isRTL ? 'شاهد مراحل التشخيص والإصلاح الفعلية.' : 'Watch real diagnostic and repair stages.' },
              { to: '/work/transformations', icon: I.sparkle, title: isRTL ? 'قبل وبعد الإصلاح' : 'Before & After', desc: isRTL ? 'نتائج مرئية لاستعادة كفاءة الأجهزة.' : 'Visible results showing restored appliance performance.' },
            ].map(card => (
              <Link className="content-hub-card" to={card.to} key={card.to}>
                <span className="content-hub-icon">{card.icon}</span>
                <span className="content-hub-copy"><strong>{card.title}</strong><small>{card.desc}</small></span>
                <span className="content-hub-arrow">{isRTL ? I.arrowL : I.arrowR}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Spotlight Section */}
      <section className="portfolio-cases-section" id="cases">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.check}</span>
              {isRTL ? 'مشاريع وقصص نجاح' : 'Case Studies & Success Stories'}
            </span>
            <h2 className="section-title">
              {isRTL ? 'مشاريع صيانة هندسية معقدة أنجزناها بنجاح' : 'Complex Engineering Projects Successfully Resolved'}
            </h2>
            <div className="section-divider" />
          </div>

          <div className="case-studies-cards-grid">
            {cases.map(caseItem => {
              const title = isRTL ? caseItem.titleAr : caseItem.titleEn;
              const cat = isRTL ? caseItem.categoryAr : caseItem.categoryEn;
              const challenge = isRTL ? caseItem.challengeAr : caseItem.challengeEn;
              const img = getMediaUrl(caseItem.image);

              return (
                <article className="case-study-card" key={caseItem.id}>
                  <div className="case-card-img-wrap">
                    <img src={img} alt={title} className="case-card-img" loading="lazy" decoding="async" />
                    <span className="case-category-pill">{cat}</span>
                  </div>
                  <div className="case-card-body">
                    <h3 className="case-card-title">{title}</h3>
                    <p className="case-card-excerpt">{challenge.slice(0, 140)}...</p>

                    <div className="case-metrics-row">
                      {caseItem.metrics.slice(0, 2).map((m, i) => (
                        <div className="case-mini-metric" key={i}>
                          <span className="cm-val">{localizedValue(m, isRTL)}</span>
                          <span className="cm-lbl">{isRTL ? m.labelAr : m.labelEn}</span>
                        </div>
                      ))}
                    </div>

                    <Link to={`/portfolio/${caseItem.id}`} className="btn btn-gold-outline btn-case-read">
                      <span>{isRTL ? 'قراءة دراسة الحالة كاملة' : 'Read Full Case Study'}</span>
                      <span>{isRTL ? I.arrowL : I.arrowR}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filterable Photo Gallery Section */}
      <section className="portfolio-gallery-section" id="photos">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.zoom}</span>
              {isRTL ? 'معرض الصور الميدانية' : 'Field Photo Gallery'}
            </span>
            <h2 className="section-title">{isRTL ? 'صور من ورشتنا ومواقع العمل بالرياض' : 'Workshop & On-Site Repair Photos'}</h2>
            <div className="section-divider" />
          </div>

          <div className="gallery-filter-tabs">
          <button className={`gallery-tab-btn ${filterCat === 'washer' ? 'active' : ''}`} onClick={() => setFilterCat('washer')}>{isRTL ? 'الغسالات والنشافات' : 'Washing Machines'}</button>
            <button
              className={`gallery-tab-btn ${filterCat === 'all' ? 'active' : ''}`}
              onClick={() => setFilterCat('all')}
            >
              {isRTL ? 'جميع الصور' : 'All Photos'}
            </button>
            <button
              className={`gallery-tab-btn ${filterCat === 'ac' ? 'active' : ''}`}
              onClick={() => setFilterCat('ac')}
            >
              {isRTL ? 'صيانة المكيفات' : 'AC Repairs'}
            </button>
            <button
              className={`gallery-tab-btn ${filterCat === 'fridge' ? 'active' : ''}`}
              onClick={() => setFilterCat('fridge')}
            >
              {isRTL ? 'الثلاجات والفريزرات' : 'Refrigerators'}
            </button>
            <button
              className={`gallery-tab-btn ${filterCat === 'workshop' ? 'active' : ''}`}
              onClick={() => setFilterCat('workshop')}
            >
              {isRTL ? 'الورشة والموتورات' : 'Workshop & Motors'}
            </button>
          </div>

          <div className="gallery-cards-grid">
            {filteredPhotos.map((item, idx) => {
              const title = isRTL ? item.titleAr : item.titleEn;
              const img = getMediaUrl(item.src);
              return (
                <div
                  className="gallery-card-item"
                  key={item.id}
                  onClick={() => setLightboxImg({ img, title })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setLightboxImg({ img, title })}
                >
                  <div className="gallery-card-img-wrap">
                    <img src={img} alt={title} loading="lazy" />
                    <div className="gallery-card-overlay">
                      <span className="gallery-zoom-badge">
                        {I.zoom} <span>{isRTL ? 'تكبير' : 'Zoom'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="gallery-card-caption">
                    <h4 className="caption-text">{title}</h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox-modal-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-modal-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setLightboxImg(null)}>
              {I.close}
            </button>
            <div className="lightbox-image-container">
              <img src={lightboxImg.img} alt={lightboxImg.title} />
              <div className="lightbox-caption-bar">
                <span className="lightbox-title-text">{lightboxImg.title}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
