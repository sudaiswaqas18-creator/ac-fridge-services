import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import { API_BASE } from '../config.js';

export default function Hero() {
  const { isRTL } = useLanguage();
  const { saveInquiry } = useData();
  const videoRef = useRef(null);

  const rotatingKeywords = isRTL
    ? [
        'المكيفات السبليت والشباك والمركزية',
        'الثلاجات والفريزرات وغرف التبريد',
        'الغسالات والنشافات الأوتوماتيك',
        'لف موتورات ومضخات المياه بالنحاس النقي',
      ]
    : [
        'Split, Window & Ducted Central ACs',
        'Refrigerators, Freezers & Cold Rooms',
        'Automatic Washers & Dryers',
        'Pure Copper Motor & Pump Rewinding',
      ];

  const [wordIdx, setWordIdx] = useState(0);
  const [fadeState, setFadeState] = useState('fade-in');

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState('fade-out');
      setTimeout(() => {
        setWordIdx(prev => (prev + 1) % rotatingKeywords.length);
        setFadeState('fade-in');
      }, 300);
    }, 3200);
    return () => clearInterval(interval);
  }, [rotatingKeywords.length]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
      videoRef.current.play().catch(() => {
        // Autoplay fallback
      });
    }
  }, []);

  // Cascading Categories & Sub-Services (Task 3)
  const SERVICE_CATEGORIES = [
    {
      id: 'ac',
      icon: '❄️',
      nameAr: 'صيانة وتكييف الهواء',
      nameEn: 'AC Maintenance & Repair',
      subServices: [
        { ar: 'صيانة وتنظيف مكيف سبليت (غسيل مضخة)', en: 'Split AC Deep Pressure Wash' },
        { ar: 'شحن فريون أصلي وكشف تسريب رقمي', en: 'OEM Freon Refill & Electronic Leak Test' },
        { ar: 'صيانة تكييف مركزي وباكج وكونسيلد', en: 'Central & Concealed Ducted HVAC' },
        { ar: 'صيانة مكيف شباك ودولابي', en: 'Window & Floor-Standing AC Care' },
        { ar: 'إصلاح الكمبروسر وتبديل كباستور', en: 'Compressor & Capacitor Replacement' },
      ],
    },
    {
      id: 'fridge',
      icon: '🧊',
      nameAr: 'الثلاجات والفريزرات المنزلية والتجارية',
      nameEn: 'Refrigerators & Freezers',
      subServices: [
        { ar: 'إصلاح تسريب الماء وضعف التبريد', en: 'Fix Water Leak & Low Cooling Issue' },
        { ar: 'صيانة نظام الديفروست وقطع الثلج', en: 'Defrost Heater & Sensor Diagnostics' },
        { ar: 'تغيير ربل (كاوتش) الباب المغناطيسي', en: 'Door Gasket Magnetic Seal Replacement' },
        { ar: 'استبدال موتور الثلاجة وشحن غاز R134a/R600a', en: 'Compressor Replacement & Gas Refill' },
        { ar: 'صيانة غرف التبريد والتجميد التجاري', en: 'Commercial Walk-in Freezers Repair' },
      ],
    },
    {
      id: 'motor',
      icon: '🌀',
      nameAr: 'لف المحركات واللحام ولوازم الدينمو',
      nameEn: 'Motor Rewinding & Brazing',
      subServices: [
        { ar: 'إعادة لف محرك مروحة التكييف بالنحاس النقي', en: 'AC Fan & Blower Motor Copper Rewind' },
        { ar: 'لف وتجديد دينمو ومضخات المياه', en: 'Water Pump & Dynamo Rewinding' },
        { ar: 'لحام مواسير النحاس والألمنيوم (Brazing)', en: 'Copper & Aluminum Pipe Oxy-Brazing' },
        { ar: 'تغيير رمان بلي (Bearings) وميكانيكال سيل', en: 'Heavy-Duty Bearings & Mechanical Seals' },
      ],
    },
    {
      id: 'washer',
      icon: '🧺',
      nameAr: 'الغسالات والنشافات الأوتوماتيكية',
      nameEn: 'Washing Machines & Dryers',
      subServices: [
        { ar: 'إصلاح عدم الدوران والعصر والتنشيف', en: 'Drum Not Spinning & Drain Pump Repair' },
        { ar: 'تبديل مساعدات الحلة ومانع الاهتزاز', en: 'Suspension Shocks & Anti-Vibration Pads' },
        { ar: 'صيانة وبرمجة كارتة التحكم الإلكترونية', en: 'Control Board & Inverter Diagnostics' },
      ],
    },
  ];

  const [selectedCatId, setSelectedCatId] = useState('ac');
  const [selectedSubService, setSelectedSubService] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');

  const currentCat = SERVICE_CATEGORIES.find(c => c.id === selectedCatId) || SERVICE_CATEGORIES[0];

  const handleQuickDispatch = e => {
    e.preventDefault();
    const chosenSub = selectedSubService || (isRTL ? currentCat.subServices[0].ar : currentCat.subServices[0].en);
    const catName = isRTL ? currentCat.nameAr : currentCat.nameEn;
    const dist = district || (isRTL ? 'الرياض' : 'Riyadh');
    const ph = phone || '';

    // 1. Save to DataContext (Task 4 sync)
    const newBooking = {
      id: `hero-${Date.now()}`,
      name: isRTL ? 'طلب حجز من الصفحة الرئيسية' : 'Hero Quick Booking',
      phone: ph || 'WhatsApp Direct',
      area: dist,
      service: `${catName} - ${chosenSub}`,
      notes: isRTL ? 'تم الحجز عبر شريط الحجز الفوري التفاعلي' : 'Booked via Hero Interactive Dispatch Bar',
      date: new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US'),
      status: 'new',
    };
    saveInquiry(newBooking);

    // 2. Sync to Backend API
    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch(() => {});

    // 3. Open WhatsApp
    const msg = isRTL
      ? `طلب حجز فني صيانة عاجل من موقع جوزاء:\n🛠️ القسم: ${catName}\n⚡ الخدمة الفرعية: ${chosenSub}\n📍 الحي بالرياض: ${dist}\n📱 رقم الجوال: ${ph || 'عبر واتساب'}\n⏱️ نرجو تأكيد موعد وصول الفني اليوم.`
      : `Urgent Technician Booking Request from Jawzaa Website:\n🛠️ Category: ${catName}\n⚡ Sub-Service: ${chosenSub}\n📍 Riyadh District: ${dist}\n📱 Contact Phone: ${ph || 'via WhatsApp'}\n⏱️ Please confirm same-day dispatch time.`;

    window.open(waLink(msg), '_blank', 'noopener');
  };

  return (
    <section className="hero-video-master" id="home">
      {/* Background Cinematic Video (Task 1: Video Project 3.mp4 with Animation feel) */}
      <div className="hero-video-bg-container" aria-hidden="true">
        <video
          ref={videoRef}
          className="hero-bg-video animated-video-filter"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        >
          <source src="/videos/Video Project 3.mp4" type="video/mp4" />
        </video>

        {/* Ambient Glow Particle Animation Overlay */}
        <div className="hero-ambient-glow" />
        <div className="hero-video-overlay" />
        <div className="hero-bottom-shadow-gradient" />
      </div>

      <div className="container hero-video-content-container">
        {/* Top Trust Badge */}
        <div className="hero-top-trust-pill floating-trust-pill">
          <span className="live-ping-dot" />
          <span>
            {isRTL
              ? 'المركز الهندسي المعتمد لصيانة التكييف والأجهزة المنزلية بالرياض'
              : 'Certified Engineering Center for HVAC & Appliance Repair in Riyadh'}
          </span>
        </div>

        {/* Headline */}
        <h1 className="hero-cinema-h1">
          <span className="headline-tagline">
            {isRTL ? 'نحن نفحص بدقة • نصلح بإتقان • نضمن 100%' : 'We Diagnose. We Repair. We Guarantee.'}
          </span>
          <br />
          <span className="headline-gold-gradient">
            {isRTL ? 'صيانة هندسية معتمدة لـ ' : 'Expert Home Repair & Renovation for '}
          </span>
          <span className={`headline-rotating-word ${fadeState}`}>
            {rotatingKeywords[wordIdx]}
          </span>
          <br />
          <span className="headline-city-sub">
            {isRTL ? 'في جميع أحياء الرياض بضمان معتمد' : 'Across All Riyadh Districts with Official Warranty'}
          </span>
        </h1>

        {/* Subheadline */}
        <p className="hero-cinema-lead">
          {isRTL
            ? 'فنيون معتمدون مجهزون بأحدث أجهزة الفحص الرقمية وكشف تسريب الفريون • خدمة منزلية سريعة بنفس اليوم خلال 30 دقيقة • قطع غيار أصلية 100% بضمان خطي معتمد وأسعار شفافة محددة مسبقاً.'
            : 'From HVAC & refrigeration fixes to complete equipment overhauls — our licensed technicians deliver quality workmanship, on time and within budget. Serving residential and commercial clients across Riyadh.'}
        </p>

        {/* Interactive 2-Step Cascading Booking Box (Task 3) */}
        <div className="hero-video-dispatch-bar cascading-dispatch-box">
          <div className="dispatch-bar-header">
            <span className="dispatch-radar-icon animated-radar-icon">{I.bolt}</span>
            <span className="dispatch-bar-title">
              {isRTL ? 'حجز فني صيانة عاجل في 60 ثانية (خصم 15% على الفحص الميداني)' : 'Book an Urgent On-Site Technician in 60 Seconds (15% Off Diagnosis)'}
            </span>
          </div>

          {/* Category Tabs Switcher */}
          <div className="hero-service-tabs-row">
            {SERVICE_CATEGORIES.map(cat => {
              const isActive = cat.id === selectedCatId;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => {
                    setSelectedCatId(cat.id);
                    setSelectedSubService('');
                  }}
                  className={`hero-cat-tab-btn ${isActive ? 'active' : ''}`}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <span className="cat-name">{isRTL ? cat.nameAr : cat.nameEn}</span>
                </button>
              );
            })}
          </div>

          {/* Animated Sub-Services Chips Grid */}
          <div className="hero-subservices-wrapper animated-sub-grid">
            <div className="subservices-label">
              <span>{isRTL ? 'اختر الخدمة المطلوبة:' : 'Select Sub-Service:'}</span>
            </div>
            <div className="hero-subservices-chips">
              {currentCat.subServices.map((sub, idx) => {
                const subText = isRTL ? sub.ar : sub.en;
                const isSelected = selectedSubService === subText || (!selectedSubService && idx === 0);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedSubService(subText)}
                    className={`subservice-chip ${isSelected ? 'selected' : ''}`}
                  >
                    <span className="chip-check">{isSelected ? '✓ ' : '• '}</span>
                    <span>{subText}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Inputs (District & Phone) + Submit Button */}
          <form onSubmit={handleQuickDispatch} className="video-dispatch-form">
            <div className="video-dispatch-field">
              <label htmlFor="hero-video-dist">
                {isRTL ? 'الحي بالرياض' : 'Riyadh District'}
              </label>
              <input
                id="hero-video-dist"
                type="text"
                placeholder={isRTL ? 'مثال: الياسمين، الروضة، الملقا...' : 'e.g. Al-Yasmin, Al-Malqa...'}
                value={district}
                onChange={e => setDistrict(e.target.value)}
                required
              />
            </div>

            <div className="video-dispatch-field">
              <label htmlFor="hero-video-phone">
                {isRTL ? 'رقم الجوال' : 'Phone Number'}
              </label>
              <input
                id="hero-video-phone"
                type="tel"
                dir="ltr"
                placeholder="05xxxxxxxx"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-wa btn-video-dispatch-submit pulse-cta-btn">
              <span className="btn-icon">{I.whatsapp}</span>
              <span>{isRTL ? 'طلب فني فوري' : 'Dispatch Technician Now'}</span>
            </button>
          </form>

          <div className="video-dispatch-guarantees">
            <span>{I.shield} {isRTL ? 'ضمان خطي معتمد حتى 6 أشهر' : 'Certified Warranty Up to 6 Months'}</span>
            <span className="v-dot">•</span>
            <span>{I.wallet} {isRTL ? 'لا دفع إلا بعد إتمام الإصلاح' : 'No payment until satisfaction'}</span>
            <span className="v-dot">•</span>
            <span>{I.clock} {isRTL ? 'خدمة يومية 8 ص - 12 ليلاً' : 'Daily 8 AM - Midnight'}</span>
          </div>
        </div>

        {/* Dual CTA Buttons */}
        <div className="hero-cinema-cta-row">
          <a
            className="btn btn-wa btn-hero-wa glow-on-hover"
            href={waLink(isRTL ? 'السلام عليكم، أحتاج فني صيانة تكييف وأجهزة فوري من جوزاء' : 'Hello, I need an urgent repair technician from Jawzaa')}
            target="_blank"
            rel="noopener"
          >
            {I.whatsapp}
            <span>{isRTL ? 'محادثة فورية عبر واتساب' : 'Get Free Estimate via WhatsApp'}</span>
          </a>

          <a className="btn btn-gold-outline btn-hero-call hover-lift" href={`tel:${BRAND.phonePrimaryIntl}`}>
            {I.phone}
            <span>{isRTL ? 'اتصال مباشر:' : 'Direct Call:'} <strong dir="ltr">{BRAND.phonePrimary}</strong></span>
          </a>

          <Link to="/portfolio" className="btn btn-navy-glass btn-hero-videos hover-lift">
            <span className="play-btn-icon">{I.bolt}</span>
            <span>{isRTL ? 'شاهد مشاريعنا وأعمالنا' : 'View Our Projects'}</span>
          </Link>
        </div>

        {/* 4 Pillars of Excellence */}
        <div className="hero-video-pillars-grid">
          <div className="v-pillar-card interactive-pillar-card">
            <div className="v-pillar-icon animated-icon">{I.shield}</div>
            <div className="v-pillar-body">
              <strong>{isRTL ? 'ضمان معتمد حتى 6 أشهر' : 'Up to 6 Months Warranty'}</strong>
              <p>{isRTL ? 'سند ضمان خطي على جميع الإصلاحات والقطع' : 'Written certificate on all repairs & parts'}</p>
            </div>
          </div>

          <div className="v-pillar-card interactive-pillar-card">
            <div className="v-pillar-icon animated-icon">{I.clock}</div>
            <div className="v-pillar-body">
              <strong>{isRTL ? 'وصول سريع خلال 30 دقيقة' : '30-Min Rapid Arrival'}</strong>
              <p>{isRTL ? 'أسطول سيارات مجهز يغطي كل أحياء الرياض' : 'Guaranteed dispatch covering all Riyadh areas'}</p>
            </div>
          </div>

          <div className="v-pillar-card interactive-pillar-card">
            <div className="v-pillar-icon animated-icon">{I.wallet}</div>
            <div className="v-pillar-body">
              <strong>{isRTL ? 'تسعيرة شفافة وثابتة' : 'Transparent Fixed Quotes'}</strong>
              <p>{isRTL ? 'كشف العطل وتحديد السعر قبل البدء بالعمل' : 'Upfront diagnosis quote before starting'}</p>
            </div>
          </div>

          <div className="v-pillar-card interactive-pillar-card">
            <div className="v-pillar-icon animated-icon">{I.parts}</div>
            <div className="v-pillar-body">
              <strong>{isRTL ? 'قطع غيار أصلية 100%' : '100% Genuine OEM Parts'}</strong>
              <p>{isRTL ? 'فريون أمريكي أصلي وأسلاك نحاس نقي' : 'Original certified parts & pure copper'}</p>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <a
          href="#showcase"
          className="hero-scroll-indicator bouncing-indicator"
          aria-label="Scroll to services"
          onClick={e => {
            e.preventDefault();
            document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="scroll-arrow-icon">{I.down}</span>
        </a>
      </div>
    </section>
  );
}
