import washerImg from '../assets/media/poster-before-after-washer.webp';
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import acImg from '../assets/media/poster-before-after-ac.webp';
import fridgeImg from '../assets/media/poster-before-after-fridge.webp';
import motorImg from '../assets/media/poster-before-after-motor.webp';

export default function FeaturedShowcase() {
  const { isRTL } = useLanguage();

  const cards = [
    {
      id: 'washer',
      badge: isRTL ? 'فحص إلكتروني' : 'Digital Diagnostics',
      img: washerImg,
      title: isRTL ? 'صيانة وإصلاح الغسالات والنشافات الأوتوماتيكية' : 'Automatic Washer & Dryer Repair Services',
      desc: isRTL
        ? 'معالجة اهتزاز الحلة وتغيير رولمان البلي الأصلي، تصليح كروت التحكم الإلكترونية ومضخات الطرد.'
        : 'Drum bearing & suspension shock replacement, PCB control board troubleshooting, and drain pump repair.',
      link: '/services/washing-machine-repair',
    },

    {
      id: 'ac',
      img: acImg,
      badge: isRTL ? 'الأكثر طلباً' : 'Top Rated',
      title: isRTL ? 'صيانة وتنظيف المكيفات السبليت والمركزية' : 'Split & Central AC Overhaul & Pressure Cleaning',
      desc: isRTL
        ? 'غسيل بمضخات الضغط العالي، فحص تسريب الفريون، معالجة نقص التبريد، واستبدال الكمبروسرات الأصلية.'
        : 'High-pressure chemical washing, digital freon leak detection, cooling restoration, and OEM compressor repair.',
      link: '/services/ac-repair',
    },
    {
      id: 'fridge',
      badge: isRTL ? 'خدمة منزلية فورية' : 'Same-Day Home Visit',
      img: fridgeImg,
      title: isRTL ? 'تصليح الثلاجات والفريزرات وغرف التبريد' : 'Refrigerator & Deep Freezer Diagnostics',
      desc: isRTL
        ? 'إصلاح دورات التبريد، تغيير حساسات السخان والديفروست، وضبط الثرموستات لكافة الماركات العالمية.'
        : 'Refrigeration circuit repair, defrost heater replacement, thermostat calibration, and gas leak fixes.',
      link: '/services/refrigerator-repair',
    },
    {
      id: 'motor',
      badge: isRTL ? 'نحاس نقي 100%' : '100% Pure Copper',
      img: motorImg,
      title: isRTL ? 'لف وإصلاح الموتورات ومضخات المياه' : 'Pure Copper Electric Motor & Pump Rewinding',
      desc: isRTL
        ? 'إعادة بناء محركات التكييف والمضخات الغاطسة بأسلاك نحاس معزولة حرارياً واختبار عزل إلكتروني دقيق.'
        : 'Precision rewinding for blower motors & water pumps using heat-insulated copper with load testing.',
      link: '/services/motor-rewinding',
    },
  ];

  return (
    <section className="showcase-4card-section" id="showcase">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.tools}</span>
            {isRTL ? 'أبرز تخصصاتنا الميدانية' : 'Featured Core Specializations'}
          </span>
          <h2 className="section-title">
            {isRTL ? 'خدمات هندسية متكاملة بأعلى معايير الجودة' : 'Comprehensive Engineering Services Across Riyadh'}
          </h2>
          <p className="section-subtitle">
            {isRTL
              ? 'اختر الخدمة المطلوبة للاطلاع على تفاصيل الأعطال وخطوات الفحص والباقات المعتمدة بضمان خطي'
              : 'Select a specialized service to explore diagnostic procedures, repair steps, and certified packages.'}
          </p>
          <div className="section-divider" />
        </div>

        {/* 4-Card Grid with Strict CSS Grid Layout & Hover Zoom */}
        <div className="showcase-4cards-grid">
          {cards.map(card => (
            <article className="showcase-4card-item" key={card.id}>
              <div className={`card-top-image-wrap ${card.id === 'motor' ? 'motor-comparison-image' : ''}`}>
                <img
                  src={card.img}
                  alt={card.title}
                  loading="lazy"
                  className="card-feature-img"
                  width="400"
                  height="220"
                />
                <span className="card-top-badge">{card.badge}</span>
                <div className="card-image-hover-overlay">
                  <Link to={card.link} className="btn-overlay-learn-more">
                    <span>{isRTL ? 'تفاصيل الخدمة' : 'View Details'}</span>
                    <span className="arrow-icon">{isRTL ? I.arrowL : I.arrowR}</span>
                  </Link>
                </div>
              </div>

              <div className="card-bottom-content">
                <h3 className="card-service-title">
                  <Link to={card.link}>{card.title}</Link>
                </h3>
                <p className="card-service-desc">{card.desc}</p>

                <div className="card-action-footer">
                  <Link to={card.link} className="card-read-more-link">
                    <span>{isRTL ? 'اقرأ المزيد وباقات الأسعار' : 'Read More & Pricing'}</span>
                    <span className="link-arrow">{isRTL ? I.arrowL : I.arrowR}</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
