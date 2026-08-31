import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { DETAILED_SERVICES } from '../content/siteData.js';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import { localizedValue } from '../localizedValue.js';

const mediaGlob = import.meta.glob('../assets/media/*.webp', { eager: true, import: 'default' });
const getMediaUrl = name => mediaGlob[`../assets/media/${name}.webp`];

export default function ServiceDetailPage() {
  const { serviceId } = useParams();
  const { isRTL } = useLanguage();
  const { services } = useData();
  const [openFaq, setOpenFaq] = useState(0);

  const dynamicService = services.find(s => s.slug === serviceId);
  const fallbackService = DETAILED_SERVICES[serviceId] || Object.values(DETAILED_SERVICES).find(s => s.slug === serviceId);
  const service = dynamicService ? { ...(fallbackService || {}), ...dynamicService } : fallbackService;

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const title = isRTL ? service.titleAr : service.titleEn;
  const subtitle = isRTL ? service.subtitleAr : service.subtitleEn;
  const overview = (isRTL ? service.overviewAr : service.overviewEn) || subtitle;
  const symptoms = isRTL ? (service.symptomsAddressedAr || []) : (service.symptomsAddressedEn || []);
  const steps = isRTL ? (service.processStepsAr || []) : (service.processStepsEn || []);

  const heroImgUrl = service.heroImage ? getMediaUrl(service.heroImage) : getMediaUrl('workshop-technician-wide');

  // Other services for sidebar
  const otherServices = services.filter(s => s.slug !== service.slug);

  return (
    <div className="service-detail-view">
      {/* Service Hero Banner */}
      <section className="service-hero-banner">
        <div className="service-hero-glow" />
        <div className="container service-hero-grid">
          <div className="service-hero-text">
            <div className="service-breadcrumbs">
              <Link to="/">{isRTL ? 'الرئيسية' : 'Home'}</Link>
              <span>/</span>
              <Link to="/services">{isRTL ? 'الخدمات' : 'Services'}</Link>
              <span>/</span>
              <span className="current-crumb">{title}</span>
            </div>

            <h1 className="service-hero-title">{title}</h1>
            <p className="service-hero-subtitle">{subtitle}</p>

            <div className="service-hero-actions">
              <a
                className="btn btn-wa btn-service-hero-wa"
                href={waLink(
                  isRTL
                    ? `السلام عليكم، أرغب بحجز فني لخدمة: "${service.titleAr}" في الرياض.`
                    : `Hello, I would like to book a technician for: "${service.titleEn}" in Riyadh.`
                )}
                target="_blank"
                rel="noopener"
              >
                {I.whatsapp} {isRTL ? 'احجز فني لهذه الخدمة الآن' : 'Book Technician for This Service'}
              </a>

              <a className="btn btn-gold-outline" href={`tel:${BRAND.phonePrimaryIntl}`}>
                {I.phone} <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>
            </div>
          </div>

          {heroImgUrl && (
            <div className="service-hero-visual">
              <div className="service-hero-img-wrap">
                <img src={heroImgUrl} alt={title} className="service-hero-img" />
                <div className="service-hero-badge-float">
                  <span className="badge-check">{I.shield}</span>
                  <div>
                    <strong>{isRTL ? 'ضمان معتمد 100%' : '100% Certified Warranty'}</strong>
                    <p>{isRTL ? 'فنيون محترفون وقطع أصلية' : 'Expert technicians & OEM parts'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Metrics Bar */}
      {service.stats && (
        <section className="service-stats-strip">
          <div className="container stats-strip-grid">
            {service.stats.map((stat, i) => {
              const displayVal = localizedValue(stat, isRTL);

              return (
                <div className="stat-strip-box" key={i}>
                  <div className="stat-strip-val">{displayVal}</div>
                  <div className="stat-strip-lbl">{isRTL ? stat.labelAr : stat.labelEn}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Content & Sidebar Layout */}
      <section className="service-main-content-section">
        <div className="container service-layout-split">
          {/* Main Article Body */}
          <div className="service-article-column">
            {/* Overview */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'نظرة عامة وشرح تفصيلي للخدمة' : 'Detailed Service Overview'}</h2>
              <div className="overview-paragraphs">
                {overview.split('\n\n').map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </div>

            {/* Symptoms Addressed */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'الأعطال والمشاكل الشائعة التي نعالجها' : 'Common Malfunctions We Resolve'}</h2>
              <div className="symptoms-checklist-grid">
                {symptoms.map((symptom, idx) => (
                  <div className="symptom-check-item" key={idx}>
                    <span className="check-bullet">{I.check}</span>
                    <span>{symptom}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Step Engineering Protocol */}
            <div className="service-content-block">
              <h2 className="block-title">{isRTL ? 'خطوات تنفيذ الخدمة والمعايير الفنية' : 'Our Engineering Workflow'}</h2>
              <div className="service-steps-list">
                {steps.map((step, idx) => (
                  <div className="service-step-row" key={idx}>
                    <div className="step-num-pill">{step.num}</div>
                    <div className="step-text-content">
                      <h4 className="step-row-title">{step.title}</h4>
                      <p className="step-row-desc">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Packages */}
            {service.pricingTiers && (
              <div className="service-content-block">
                <h2 className="block-title">{isRTL ? 'باقات وتكاليف الخدمة الشفافة' : 'Transparent Pricing Packages'}</h2>
                <div className="service-pricing-cards-grid">
                  {service.pricingTiers.map((tier, idx) => (
                    <div className={`pricing-package-card ${tier.isPopular ? 'popular-tier' : ''}`} key={idx}>
                      {tier.isPopular && (
                        <div className="popular-badge-pill">{isRTL ? 'الأكثر طلباً' : 'Most Popular'}</div>
                      )}
                      <h3 className="package-name">{isRTL ? tier.nameAr : tier.nameEn}</h3>
                      <div className="package-price">{isRTL ? tier.priceAr : tier.priceEn}</div>
                      <p className="package-desc">{isRTL ? tier.descAr : tier.descEn}</p>

                      <ul className="package-features-list">
                        {(isRTL ? tier.featuresAr : tier.featuresEn).map((feat, i) => (
                          <li key={i}>
                            <span className="feat-check">{I.check}</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        className="btn btn-gold btn-package-book"
                        href={waLink(
                          isRTL
                            ? `السلام عليكم، أرغب بطلب باقة "${tier.nameAr}" لخدمة "${service.titleAr}".`
                            : `Hello, I would like to book the "${tier.nameEn}" package for "${service.titleEn}".`
                        )}
                        target="_blank"
                        rel="noopener"
                      >
                        {I.whatsapp} {isRTL ? 'طلب هذه الباقة' : 'Select Package'}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service FAQs */}
            {service.faqs && (
              <div className="service-content-block">
                <h2 className="block-title">{isRTL ? 'أسئلة شائعة حول هذه الخدمة' : 'Service-Specific FAQs'}</h2>
                <div className="service-faqs-accordion">
                  {service.faqs.map((faq, idx) => {
                    const isOpen = openFaq === idx;
                    return (
                      <div className={`faq-row-item ${isOpen ? 'open' : ''}`} key={idx}>
                        <button className="faq-row-btn" onClick={() => setOpenFaq(isOpen ? -1 : idx)}>
                          <span>{isRTL ? faq.qAr : faq.qEn}</span>
                          <span className="faq-toggle-plus">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && <p className="faq-row-ans">{isRTL ? faq.aAr : faq.aEn}</p>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar */}
          <aside className="service-sidebar-column">
            {/* Direct Booking Card */}
            <div className="sidebar-booking-card">
              <h3 className="sb-title">{isRTL ? 'احجز موعداً في دقيقة' : 'Book in 60 Seconds'}</h3>
              <p className="sb-desc">
                {isRTL ? 'فنيونا جاهزون للوصول إلى منزلك في نفس اليوم.' : 'Our technicians are ready to dispatch today.'}
              </p>
              <a
                className="btn btn-wa btn-sb-book"
                href={waLink(
                  isRTL
                    ? `السلام عليكم، أرغب بحجز موعد صيانة لخدمة: ${service.titleAr}`
                    : `Hello, I want to book a service appointment for: ${service.titleEn}`
                )}
                target="_blank"
                rel="noopener"
              >
                {I.whatsapp} {isRTL ? 'حجز فوري عبر واتساب' : 'Instant WhatsApp Booking'}
              </a>
              <a className="btn btn-gold-outline btn-sb-call" href={`tel:${BRAND.phonePrimaryIntl}`}>
                {I.phone} {isRTL ? 'اتصال مباشر' : 'Direct Call'}: <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>

              <div className="sb-guarantees">
                <div className="sb-g-item">
                  <span className="g-icon">{I.shield}</span>
                  <span>{isRTL ? 'ضمان خطي على القطع والإصلاح' : 'Official written warranty on parts'}</span>
                </div>
                <div className="sb-g-item">
                  <span className="g-icon">{I.clock}</span>
                  <span>{isRTL ? 'استجابة سريعة في نفس اليوم' : 'Fast same-day arrival'}</span>
                </div>
                <div className="sb-g-item">
                  <span className="g-icon">{I.wallet}</span>
                  <span>{isRTL ? 'أسعار محددة وشفافة قبل البدء' : 'Transparent upfront quote'}</span>
                </div>
              </div>
            </div>

            {/* Other Services Navigation */}
            <div className="sidebar-links-card">
              <h4 className="sb-links-heading">{isRTL ? 'خدمات صيانة أخرى' : 'Other Services'}</h4>
              <ul className="sb-links-list">
                {otherServices.map(s => (
                  <li key={s.slug}>
                    <Link to={`/services/${s.slug}`} className="sb-service-link">
                      <span>{isRTL ? s.titleAr : s.titleEn}</span>
                      <span className="sb-link-arrow">{isRTL ? '←' : '→'}</span>
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
