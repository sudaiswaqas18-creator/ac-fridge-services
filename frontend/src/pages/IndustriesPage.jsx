import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';

export default function IndustriesPage() {
  const { isRTL } = useLanguage();
  const { industries } = useData();

  return (
    <div className="industries-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.bolt}</span>
            {isRTL ? 'القطاعات والحلول المتخصصة' : 'Industry Solutions & Verticals'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'حلول تبريد وتكييف مصممة خصيصاً لكل قطاع' : 'Engineered HVAC Solutions for Every Industry Sector'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'سواء كنت مالك فيلا سكنية، أو تدير سلسلة مطاعم، أو مسؤولاً عن منشأة تجارية؛ نوفر لك باقات صيانة تناسب طبيعة عملك بدقة.'
              : 'Whether you own a luxury villa, operate a restaurant chain, or manage commercial facilities, we deliver tailored maintenance packages.'}
          </p>
        </div>
      </section>

      <section className="industries-grid-section">
        <div className="container">
          <div className="industries-cards-layout">
            {industries.map(ind => (
              <div className="industry-sector-card" id={ind.id} key={ind.id}>
                <div className="ind-header-row">
                  <div className="ind-icon-box">{I[ind.icon] || I.tools}</div>
                  <div>
                    <h2 className="ind-card-title">{isRTL ? ind.titleAr : ind.titleEn}</h2>
                  </div>
                </div>

                <p className="ind-card-desc">{isRTL ? ind.descAr : ind.descEn}</p>

                <div className="ind-features-box">
                  <h4 className="ind-features-title">{isRTL ? 'أبرز مزايا الخدمة لهذا القطاع:' : 'Sector-Specific Advantages:'}</h4>
                  <ul className="ind-features-list">
                    {(isRTL ? ind.featuresAr : ind.featuresEn).map((f, i) => (
                      <li key={i}>
                        <span className="feat-bullet">{I.check}</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ind-card-footer" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link
                    to={`/industries/${ind.id}`}
                    className="btn btn-navy"
                    style={{ flex: 1, minWidth: '160px', textAlign: 'center' }}
                  >
                    <span>{isRTL ? 'تفاصيل وحلول القطاع' : 'Sector Details & Plans'}</span>
                    <span>{isRTL ? I.arrowL : I.arrowR}</span>
                  </Link>
                  <a
                    className="btn btn-gold btn-ind-cta"
                    style={{ flex: 1, minWidth: '160px' }}
                    href={waLink(
                      isRTL
                        ? `السلام عليكم، أرغب بطلب عرض سعر لحلول قطاع: "${ind.titleAr}".`
                        : `Hello, I would like a quote for sector solutions: "${ind.titleEn}".`
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    {I.whatsapp} {isRTL ? 'طلب عرض سعر' : 'Request Quote'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
