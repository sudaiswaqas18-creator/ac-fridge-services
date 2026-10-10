import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { CASE_STUDIES } from '../content/siteData.js';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import { localizedValue } from '../localizedValue.js';

const mediaGlob = import.meta.glob(['../assets/media/*.webp', '!../assets/media/*washer*'], { eager: true, import: 'default' });
const getMediaUrl = name =>
  mediaGlob[`../assets/media/${name}.webp`] ||
  mediaGlob[`../assets/media/${name}`] ||
  name;

export default function CaseStudyDetailPage() {
  const { caseId } = useParams();
  const { isRTL } = useLanguage();

  const caseItem = CASE_STUDIES.find(c => c.id === caseId);

  if (!caseItem) {
    return <Navigate to="/portfolio" replace />;
  }

  const title = isRTL ? caseItem.titleAr : caseItem.titleEn;
  const client = isRTL ? caseItem.clientAr : caseItem.clientEn;
  const category = isRTL ? caseItem.categoryAr : caseItem.categoryEn;
  const challenge = isRTL ? caseItem.challengeAr : caseItem.challengeEn;
  const solution = isRTL ? caseItem.solutionAr : caseItem.solutionEn;
  const imgUrl = getMediaUrl(caseItem.image);

  return (
    <div className="case-detail-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner work-detail-hero">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <div className="service-breadcrumbs">
            <Link to="/">{isRTL ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <Link to="/portfolio">{isRTL ? 'أعمالنا والمشاريع' : 'Case Studies'}</Link>
            <span>/</span>
            <span className="current-crumb">{category}</span>
          </div>

          <h1 className="subpage-hero-title">{title}</h1>
          <p className="subpage-hero-desc">
            {isRTL ? `مشروع معتمد تم تنفيذه لصالح: ${client}` : `Documented engineering project executed for: ${client}`}
          </p>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="case-metrics-strip">
        <div className="container case-metrics-grid">
          {caseItem.metrics.map((m, idx) => (
            <div className="metric-strip-card" key={idx}>
              <div className="m-val">{localizedValue(m, isRTL)}</div>
              <div className="m-lbl">{isRTL ? m.labelAr : m.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Case Details Body */}
      <section className="case-body-section">
        <div className="container case-body-grid">
          <div className="case-main-column">
            {imgUrl && (
              <div className="case-featured-img-frame">
                <img src={imgUrl} alt={title} className="case-featured-img" />
              </div>
            )}

            {/* Challenge */}
            <div className="case-content-card">
              <div className="case-card-header">
                <span className="case-badge-icon">{I.bolt}</span>
                <h2 className="case-section-heading">{isRTL ? 'التحدي والمشكلة الفنية' : 'The Technical Challenge'}</h2>
              </div>
              <p className="case-section-p">{challenge}</p>
            </div>

            {/* Solution */}
            <div className="case-content-card">
              <div className="case-card-header">
                <span className="case-badge-icon">{I.tools}</span>
                <h2 className="case-section-heading">{isRTL ? 'الحل الهندسي والتنفيذ' : 'The Engineering Solution'}</h2>
              </div>
              <p className="case-section-p">{solution}</p>
            </div>

            {/* Key Deliverables */}
            <div className="case-content-card">
              <div className="case-card-header">
                <span className="case-badge-icon">{I.check}</span>
                <h2 className="case-section-heading">{isRTL ? 'المعايير المنجزة والنتائج' : 'Deliverables & Outcomes'}</h2>
              </div>
              <ul className="case-deliverables-list">
                <li>
                  <span className="bullet-check">{I.check}</span>
                  <span>{isRTL ? 'فحص كامل وشامل بالأجهزة الرقمية قبل وبعد الإصلاح' : 'Complete digital diagnostics performed before and after repair'}</span>
                </li>
                <li>
                  <span className="bullet-check">{I.check}</span>
                  <span>{isRTL ? 'استخدام قطع غيار أصلية معتمدة مع ضمان معتمد' : 'Strict deployment of OEM certified spare parts with written warranty'}</span>
                </li>
                <li>
                  <span className="bullet-check">{I.check}</span>
                  <span>{isRTL ? 'تسليم المشروع في الوقت المحدد مع تقرير فني شامل للعميل' : 'On-time milestone delivery with comprehensive technical report'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="case-sidebar-column">
            <div className="sidebar-booking-card">
              <h3 className="sb-title">{isRTL ? 'هل لديك مشروع أو عطل مماثل؟' : 'Have a Similar Project?'}</h3>
              <p className="sb-desc">
                {isRTL ? 'تواصل مع فريقنا الهندسي للحصول على معاينة فورية وعرض سعر دقيق.' : 'Consult our engineering team for instant assessment and fixed quote.'}
              </p>
              <a
                className="btn btn-wa btn-sb-book"
                href={waLink(
                  isRTL
                    ? `السلام عليكم، قرأت دراسة الحالة "${caseItem.titleAr}" وأحتاج استشارة / صيانة لمشروع مماثل.`
                    : `Hello, I read the case study "${caseItem.titleEn}" and need a consultation for a similar project.`
                )}
                target="_blank"
                rel="noopener"
              >
                {I.whatsapp} {isRTL ? 'طلب معاينة عبر واتساب' : 'Request Assessment'}
              </a>

              <a className="btn btn-gold-outline btn-sb-call" href={`tel:${BRAND.phonePrimaryIntl}`}>
                {I.phone} <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>
            </div>

            <div className="sidebar-links-card">
              <h4 className="sb-links-heading">{isRTL ? 'مشاريع أخرى' : 'Other Case Studies'}</h4>
              <ul className="sb-links-list">
                {CASE_STUDIES.filter(c => c.id !== caseItem.id).map(c => (
                  <li key={c.id}>
                    <Link to={`/portfolio/${c.id}`} className="sb-service-link">
                      <span>{isRTL ? c.titleAr : c.titleEn}</span>
                      <span>{isRTL ? I.arrowL : I.arrowR}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
