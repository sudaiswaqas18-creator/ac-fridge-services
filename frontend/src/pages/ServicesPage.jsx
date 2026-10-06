import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVICE_IMAGES } from '../content/serviceImages.js';
import Checker from '../components/Checker.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import { Stats, Features } from '../components/Services.jsx';
import { waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';

const mediaGlob = import.meta.glob('../assets/media/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' });
const getMediaUrl = name => {
  if (!name) return '';
  return (
    mediaGlob[`../assets/media/${name}.webp`] ||
    mediaGlob[`../assets/media/${name}.jpg`] ||
    mediaGlob[`../assets/media/${name}.png`] ||
    mediaGlob[`../assets/media/${name}`] ||
    ''
  );
};

const ICONS_MAP = {
  ac: I.ac,
  snow: I.snow,
  tools: I.tools,
  fridge: I.fridge,
  washer: I.washer,
  motor: I.motor,
  diagnosis: I.diagnosis,
  contract: I.contract,
};

const DEFAULT_SERVICE_IMAGES = {
  'ac-repair': 'poster-ac-repair-riyadh',
  'ac-cleaning': 'poster-ac-jet-cleaning',
  'central-hvac': 'poster-commercial-hvac-maintenance',
  'refrigerator-repair': 'fridge-repair-bay',
  'washing-machine-repair': 'poster-before-after-washer',
  'motor-rewinding': 'poster-motor-rewinding',
  'electronic-diagnostics': 'poster-correct-diagnosis',
  'maintenance-contracts': 'poster-summer-maintenance',
  'annual-contracts': 'poster-summer-maintenance',
  'ac-repair-riyadh': 'poster-ac-repair-riyadh',
  'ac-cleaning-installation': 'poster-ac-jet-cleaning',
  'central-hvac-maintenance': 'poster-commercial-hvac-maintenance',
  'refrigerator-freezer-repair': 'fridge-repair-bay',
  'washing-machine-dryer': 'poster-before-after-washer',
  'motor-rewinding-welding': 'poster-motor-rewinding',
  'fault-diagnosis-inspection': 'poster-correct-diagnosis',
  'commercial-maintenance-contracts': 'poster-summer-maintenance',
};

const CATEGORIES_LIST = [
  { id: 'all', icon: I.sparkle, labelAr: 'جميع الخدمات المعتمدة', labelEn: 'All Services' },
  { id: 'ac', icon: I.ac, labelAr: 'صيانة التكييف والتهوية', labelEn: 'AC & HVAC' },
  { id: 'fridge', icon: I.fridge, labelAr: 'الثلاجات والفريزرات', labelEn: 'Refrigerators' },
  { id: 'washer', icon: I.washer, labelAr: 'الغسالات والأجهزة', labelEn: 'Home Appliances' },
  { id: 'motor', icon: I.motor, labelAr: 'لف المحركات واللحام', labelEn: 'Motor Rewinding' },
  { id: 'contract', icon: I.contract, labelAr: 'العقود والمنشآت', labelEn: 'Commercial Contracts' },
];

export default function ServicesPage() {
  const { isRTL } = useLanguage();
  const { services } = useData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = services.filter(svc => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'ac') return svc.slug.includes('ac') || svc.slug.includes('hvac');
    if (activeCategory === 'fridge') return svc.slug.includes('fridge') || svc.slug.includes('refrigerator');
    if (activeCategory === 'washer') return svc.slug.includes('washer') || svc.slug.includes('washing');
    if (activeCategory === 'motor') return svc.slug.includes('motor') || svc.slug.includes('rewinding');
    if (activeCategory === 'contract') return svc.slug.includes('contract') || svc.slug.includes('commercial');
    return true;
  });

  return (
    <div className="services-page-view">
      {/* Subpage Hero Banner */}
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.tools}</span>
            {isRTL ? 'دليل الخدمات الهندسية الشامل' : 'Comprehensive Engineering Directory'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'خدمات صيانة المكيفات والأجهزة المنزلية بالرياض' : 'Professional Appliance & HVAC Services in Riyadh'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'تصفح خدماتنا المصنفة بدقة لاكتشاف التفاصيل الفنية، باقات الأسعار الشفافة، والضمانات المعتمدة حتى 6 أشهر.'
              : 'Browse our categorized services to explore technical diagnosis, upfront pricing tiers, and certified warranties.'}
          </p>
        </div>
      </section>

      {/* Categorized Services Section */}
      <section className="services-overview-section" id="services-grid">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.tools}</span>
              {isRTL ? 'أقسام وخدمات جوزاء المعتمدة' : 'Jawzaa Specialized Categories'}
            </span>
            <h2 className="section-title">
              {isRTL ? 'اختر تصنيف الخدمة لاستعراض الباقات والأسعار' : 'Select a Category to Explore Services & Pricing'}
            </h2>
            <div className="section-divider" />
          </div>

          {/* Category Filter Tabs Bar with SVG Icons */}
          <div className="services-category-tabs-bar">
            {CATEGORIES_LIST.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`service-cat-filter-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="filter-tab-icon">{cat.icon}</span>
                  <span>{isRTL ? cat.labelAr : cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          {/* Rich Services Grid with Images and Animations */}
          <div className="services-rich-grid">
            {filteredServices.map(svc => {
              const title = isRTL ? svc.titleAr : svc.titleEn;
              const subtitle = isRTL ? svc.subtitleAr : svc.subtitleEn;
              const symptoms = ((isRTL ? svc.symptomsAddressedAr : svc.symptomsAddressedEn) || []).slice(0, 2);
              const imgKey = svc.heroImage || DEFAULT_SERVICE_IMAGES[svc.slug] || 'workshop-technician-wide';
              const imgSrc = SERVICE_IMAGES[svc.slug] || getMediaUrl(imgKey);

              return (
                <article className="service-case-card" key={svc.slug}>
                  <div className="service-case-image-wrap">
                    <img src={imgSrc} alt={title} className="service-card-img" loading="lazy" decoding="async" width="1376" height="768" />
                    <span className="service-case-category">{isRTL ? 'خدمة معتمدة' : 'Certified Service'}</span>
                    <span className="service-case-icon">{ICONS_MAP[svc.icon] || I.tools}</span>
                  </div>

                  <div className="service-case-body">
                    <h3 className="service-case-title">
                      <Link to={`/services/${svc.slug}`}>{title}</Link>
                    </h3>
                    <p className="service-case-excerpt">{subtitle}</p>

                    <div className="service-case-highlights">
                      <span className="service-case-highlights-label">{isRTL ? 'أهم ما نعالجه' : 'Key Service Highlights'}</span>
                      <ul>
                        {symptoms.map((sym, idx) => (
                          <li key={idx}>
                            <span className="feature-check-icon">{I.check}</span>
                            <span>{sym}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="service-case-actions">
                      <Link to={`/services/${svc.slug}`} className="btn btn-gold-outline service-case-link">
                        <span>{isRTL ? 'تفاصيل الخدمة والأسعار' : 'View Details & Pricing'}</span>
                        <span className="arrow-sym">{isRTL ? I.arrowL : I.arrowR}</span>
                      </Link>

                      <a
                        href={waLink(isRTL ? `السلام عليكم، أرغب بطلب خدمة ${title} في الرياض` : `Hello, I want to book ${title} in Riyadh`)}
                        target="_blank"
                        rel="noopener"
                        className="service-case-wa"
                        title={isRTL ? 'حجز فوري عبر واتساب' : 'Book via WhatsApp'}
                      >
                        {I.whatsapp}
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Fault Troubleshooter */}
      <Checker />

      {/* Motor Rewinding Before/After */}
      <BeforeAfter />

      {/* Features & Stats */}
      <Features />
      <Stats />
    </div>
  );
}
