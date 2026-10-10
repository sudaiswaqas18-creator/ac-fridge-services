import React, { useState } from 'react';
import { RIYADH_AREAS, POSTER_ITEMS } from '../data.js';
import { T, BRAND } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';

const mediaGlob = import.meta.glob(['../assets/media/*.webp'], { eager: true, import: 'default' });
const getMediaUrl = name => mediaGlob[`../assets/media/${name}.webp`];

export function Reviews() {
  const { lang, isRTL } = useLanguage();
  const { reviews } = useData();
  const t = T[lang].reviewsSec;
  const seen = new Set();
  const counts = new Map();
  const visibleReviews = reviews.filter(review => {
    const text = String(review.textEn || review.textAr || '').trim().toLowerCase();
    if (!text || seen.has(text)) return false;
    seen.add(text);
    const service = String(review.serviceEn || review.serviceAr || '').toLowerCase();
    const category = /washer|washing|dryer|غسال|نشاف/.test(service) ? 'washer'
      : /contract|annual|عقد|عقود/.test(service) ? 'contract'
      : /motor|pump|rewind|موتور|محرك|مضخ/.test(service) ? 'motor'
      : /fridge|refriger|freezer|ثلاج|فريزر/.test(service) ? 'fridge' : 'ac';
    const count = counts.get(category) || 0;
    if (count >= 2) return false;
    counts.set(category, count + 1);
    return true;
  });

  return (
    <section className="reviews-section" id="reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.star}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="reviews-carousel-container">
          <div className="reviews-cards-grid">
            {visibleReviews.map((review, i) => {
              const name = isRTL ? review.nameAr : review.nameEn;
              const area = isRTL ? review.areaAr : review.areaEn;
              const service = isRTL ? review.serviceAr : review.serviceEn;
              const text = isRTL ? review.textAr : review.textEn;

              return (
                <article className="review-card" key={`${review.id}-${i}`}>
                  <div className="review-card-top">
                    <div className="review-stars-row">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx} className="star-icon">{I.star}</span>
                      ))}
                    </div>
                    <span className="verified-badge">
                      <span className="verified-icon">{I.userCheck}</span>
                      <span>{t.verified}</span>
                    </span>
                  </div>

                  <p className="review-comment-text">“{text}”</p>

                  <div className="review-service-tag">{service}</div>

                  <div className="review-author-row">
                    <div className="author-avatar">
                      {name.charAt(0)}
                    </div>
                    <div className="author-details">
                      <h4 className="author-name">{name}</h4>
                      <p className="author-area">{area}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq() {
  const { lang, isRTL } = useLanguage();
  const { faqs } = useData();
  const t = T[lang].faqSec;
  const [openIdx, setOpenIdx] = useState(0);

  const toggleFaq = idx => {
    setOpenIdx(prev => (prev === idx ? -1 : idx));
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{isRTL ? '؟' : '?'}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="faq-accordion-container">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const q = isRTL ? faq.qAr : faq.qEn;
            const a = isRTL ? faq.aAr : faq.aEn;

            return (
              <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={idx}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{q}</span>
                  <span className="faq-toggle-icon">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div className="faq-answer-collapse">
                  <p className="faq-answer-text">{a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Areas() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].areasSec;

  return (
    <section className="areas-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.pin}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="areas-chips-cloud">
          {RIYADH_AREAS.map((area, idx) => (
            <a
              href={BRAND.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="area-pill-chip"
              key={idx}
              title={isRTL ? 'موقع ورشة جوزاء' : 'Jawzaa workshop location'}
            >
              <span className="pin-mini">{I.pin}</span>
              <span>{isRTL ? `حي ${area.ar}` : `${area.en} District`}</span>
            </a>
          ))}
        </div>

        <p className="areas-footer-note">
          <span>{I.shield}</span>
          <span>{t.allAreasNote}</span>
        </p>
      </div>
    </section>
  );
}

export function Posters() {
  const { lang, isRTL } = useLanguage();
  const [selectedPoster, setSelectedPoster] = useState(null);

  return (
    <section className="posters-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.snow}</span>
            {isRTL ? 'نصائح وإرشادات الصيانة' : 'Expert Maintenance Tips'}
          </span>
          <h2 className="section-title">
            {isRTL ? 'إرشادات مهنية لإطالة عمر أجهزتك' : 'Professional Appliance Care Tips'}
          </h2>
          <p className="section-subtitle">
            {isRTL ? 'تصاميم توعوية أعدها فنيو جوزاء لمساعدتك في حماية مكيفاتك وثلاجاتك' : 'Insightful guidelines prepared by Jawzaa technicians to help you protect your appliances'}
          </p>
          <div className="section-divider" />
        </div>

        <div className="posters-grid-container">
          {POSTER_ITEMS.map((poster, i) => {
            const title = isRTL ? poster.titleAr : poster.titleEn;
            const imgSrc = getMediaUrl(poster.src);
            return (
              <div
                className="poster-card-item"
                key={poster.src}
                onClick={() => setSelectedPoster({ imgSrc, title })}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedPoster({ imgSrc, title })}
              >
                <div className="poster-img-wrap">
                  <img src={imgSrc} alt={title} loading="lazy" />
                  <div className="poster-overlay">
                    <span className="poster-zoom-btn">{I.zoom}</span>
                  </div>
                </div>
                <h4 className="poster-card-title">{title}</h4>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPoster && (
        <div
          className="lightbox-modal-backdrop"
          onClick={() => setSelectedPoster(null)}
        >
          <div
            className="lightbox-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={() => setSelectedPoster(null)}
              aria-label="Close"
            >
              {I.close}
            </button>
            <div className="lightbox-image-container">
              <img src={selectedPoster.imgSrc} alt={selectedPoster.title} />
              <div className="lightbox-caption-bar">
                <span className="lightbox-title-text">{selectedPoster.title}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
