import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DETAILED_SERVICES } from '../content/siteData.js';
import { SERVICE_IMAGES, SPECIALTY_IMAGES } from '../content/serviceImages.js';
import Checker from '../components/Checker.jsx';
import BeforeAfter from '../components/BeforeAfter.jsx';
import { Stats, Features } from '../components/Services.jsx';
import { waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';

const mediaGlob = import.meta.glob(['../assets/media/*.webp', '!../assets/media/*washer*'], { eager: true, import: 'default' });
const getMediaUrl = name => {
  if (!name) return '';
  return mediaGlob[`../assets/media/${name}.webp`] || mediaGlob[`../assets/media/${name}`] || '';
};

const ICONS_MAP = {
  ac: I.ac,
  snow: I.snow,
  tools: I.tools,
  fridge: I.fridge,
  motor: I.motor,
  diagnosis: I.diagnosis,
  contract: I.contract,
};

const DEFAULT_SERVICE_IMAGES = {
  'ac-repair': 'poster-ac-repair-riyadh',
  'ac-cleaning': 'poster-ac-jet-cleaning',
  'central-hvac': 'poster-commercial-hvac-maintenance',
  'refrigerator-repair': 'fridge-repair-bay',
  'motor-rewinding': 'poster-motor-rewinding',
  'electronic-diagnostics': 'poster-correct-diagnosis',
  'maintenance-contracts': 'poster-summer-maintenance',
  'annual-contracts': 'poster-summer-maintenance',
  'ac-repair-riyadh': 'poster-ac-repair-riyadh',
  'ac-cleaning-installation': 'poster-ac-jet-cleaning',
  'central-hvac-maintenance': 'poster-commercial-hvac-maintenance',
  'refrigerator-freezer-repair': 'fridge-repair-bay',
  'motor-rewinding-welding': 'poster-motor-rewinding',
  'fault-diagnosis-inspection': 'poster-correct-diagnosis',
  'commercial-maintenance-contracts': 'poster-summer-maintenance',
};

const CATEGORIES_LIST = [
  { id: 'all', icon: I.sparkle, labelAr: 'جميع الخدمات المعتمدة', labelEn: 'All Services' },
  { id: 'ac', icon: I.ac, labelAr: 'صيانة التكييف والتهوية', labelEn: 'AC & HVAC' },
  { id: 'fridge', icon: I.fridge, labelAr: 'الثلاجات والفريزرات', labelEn: 'Refrigerators' },
  { id: 'motor', icon: I.motor, labelAr: 'لف المحركات واللحام', labelEn: 'Motor Rewinding' },
  { id: 'contract', icon: I.contract, labelAr: 'العقود والمنشآت', labelEn: 'Commercial Contracts' },
];

export default function ServicesPage() {
  const { isRTL } = useLanguage();
  const { services } = useData();
  const [activeCategory, setActiveCategory] = useState('all');

  const categorySlugs = {
    ac: ['ac-repair', 'ac-cleaning', 'central-hvac'],
    fridge: ['refrigerator-repair'],
    motor: ['motor-rewinding'],
    contract: ['maintenance-contracts'],
  };

  const specialties = {
    fridge: [
      ['Home Refrigerator Repair', 'صيانة الثلاجات المنزلية', 'Cooling faults, thermostats and door seals for household refrigerators.', 'إصلاح ضعف التبريد والثرموستات وعوازل أبواب الثلاجات المنزلية.'],
      ['Freezer & Defrost Repair', 'صيانة الفريزرات والديفروست', 'Restore freezer performance with defrost, fan and refrigerant diagnostics.', 'استعادة كفاءة التجميد بفحص الديفروست والمراوح ودورة التبريد.'],
      ['Cold Room & Commercial Refrigeration', 'غرف التبريد والثلاجات التجارية', 'Compressor and refrigeration circuit care for cold rooms and commercial units.', 'صيانة الضواغط ودورات التبريد لغرف التبريد والوحدات التجارية.'],
    ],
    motor: [
      ['Electric Motor Rewinding', 'إعادة لف المحركات الكهربائية', 'Pure copper rewinding, insulation checks and load testing for electric motors.', 'إعادة اللف بالنحاس النقي وفحص العزل واختبار المحركات تحت الحمل.'],
      ['Water Pump Repair & Rewinding', 'صيانة وإعادة لف مضخات المياه', 'Pump winding, bearing and mechanical seal repairs to restore reliable flow.', 'إصلاح ملفات المضخات والبلي ومانع التسرب لاستعادة تدفق المياه.'],
      ['Motor Bearings & Copper Brazing', 'بلي المحركات ولحام النحاس', 'Bearing replacement, mechanical balancing and copper pipe brazing.', 'استبدال البلي والموازنة الميكانيكية ولحام مواسير النحاس.'],
    ],
    contract: [
      ['Corporate & Office HVAC Contracts', 'عقود صيانة تكييف الشركات والمكاتب والمنشآت', 'Preventive HVAC maintenance for ducted package systems, routine quarterly visits, and official ZATCA tax invoicing.', 'صيانة وقائية دورية لتكييف المكاتب والمباني الإدارية، زيارات ربع سنوية مجدولة، وفواتير ضريبية إلكترونية معتمدة.'],
      ['Restaurant & Cold Chain Contracts', 'عقود صيانة المطاعم والمقاهي وسلاسل التبريد', 'Emergency care for walk-in freezers, display chillers, and ice makers with guaranteed 2-hour priority response.', 'صيانة متخصصة لغرف التجميد والتبريد وثلاجات العرض وصانعات الثلج مع استجابة طارئة خلال ساعتين فقط.'],
      ['Annual Villa & Residential Compound Care', 'عقود الصيانة السنوية للفلل والمجمعات السكنية', 'Comprehensive annual care for all home split, ducted and refrigeration units with seasonal inspections and discounts.', 'تغطية سنوية شاملة لكافة مكيفات وثلاجات الفيلا مع فحص قبل الصيف وأولوية قصوى وخصومات على قطع الغيار.'],
    ],
  };

  const catalog = Object.entries(categorySlugs).flatMap(([category, slugs]) => {
    let originals = slugs.map(slug => services.find(s => s.slug === slug) || DETAILED_SERVICES[slug]).filter(Boolean);
    if (!originals.length && category === 'contract') {
      const fallbackContract = services.find(s => /contract/i.test(s.slug)) || DETAILED_SERVICES['maintenance-contracts'];
      if (fallbackContract) originals = [fallbackContract];
    }
    if (category === 'ac') {
      return originals.map((s, idx) => ({ ...s, category, cardId: `ac-${idx}` }));
    }
    if (!originals[0]) return [];
    return specialties[category].map(([titleEn, titleAr, subtitleEn, subtitleAr], index) => ({
      ...originals[0],
      category,
      cardId: `${category}-${index}`,
      titleEn,
      titleAr,
      subtitleEn,
      subtitleAr,
      symptomsAddressedEn: (originals[0].symptomsAddressedEn || []).slice(index * 2, index * 2 + 2),
      symptomsAddressedAr: (originals[0].symptomsAddressedAr || []).slice(index * 2, index * 2 + 2),
    }));
  });

  const filteredServices = activeCategory === 'all'
    ? catalog
    : catalog.filter(s => s.category === activeCategory);

  return (
    <div className="services-page-view">
      {/* Subpage Hero Banner with Detailed HVAC Background */}
      <section className="subpage-hero-banner services-hero-banner">
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
              if (!symptoms.length) symptoms.push(isRTL ? 'فحص دقيق وخطة صيانة واضحة' : 'Detailed inspection and a clear service plan', isRTL ? 'اختبار الأداء بعد إتمام العمل' : 'Performance testing after service');
              const imgKey = svc.heroImage || DEFAULT_SERVICE_IMAGES[svc.slug] || 'workshop-technician-wide';
              const imgSrc = SPECIALTY_IMAGES[svc.cardId] || SPECIALTY_IMAGES[svc.slug] || SERVICE_IMAGES[svc.slug] || getMediaUrl(imgKey);

              return (
                <article className="service-case-card" key={svc.cardId || svc.slug}>
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
