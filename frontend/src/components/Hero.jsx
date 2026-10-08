import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import heroBannerAc from '../assets/media/hero-banner-ac.jpg';
import heroBannerFridge from '../assets/media/hero-banner-fridge.jpg';
import heroBannerMotor from '../assets/media/hero-banner-motor.jpg';

const HERO_SLIDES = [
  {
    id: 'ac',
    image: heroBannerAc,
    path: '/services/ac-repair',
    wordEn: 'Split, Window & Ducted Central ACs',
    wordAr: 'المكيفات السبليت والشباك والمركزية',
  },
  {
    id: 'fridge',
    image: heroBannerFridge,
    path: '/services/refrigerator-repair',
    wordEn: 'Refrigerators, Freezers & Cold Rooms',
    wordAr: 'الثلاجات والفريزرات وغرف التبريد',
  },
  {
    id: 'motor',
    image: heroBannerMotor,
    path: '/services/motor-rewinding',
    wordEn: 'Pure Copper Motor & Pump Rewinding',
    wordAr: 'لف موتورات ومضخات المياه بالنحاس النقي',
  },
];

export default function Hero() {
  const { isRTL } = useLanguage();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => setCurrentSlide(index => (index + 1) % HERO_SLIDES.length), 2000);
    return () => clearInterval(timer);
  }, [paused]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-slide-heading', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' });
    }, heroRef);
    return () => ctx.revert();
  }, [currentSlide, isRTL]);

  const handleBannerClick = () => {
    navigate(HERO_SLIDES[currentSlide].path);
  };

  return (
    <section
      ref={heroRef}
      className="hero-video-master restored-hero polished-hero hero-clickable-banner"
      id="home"
      onClick={handleBannerClick}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleBannerClick();
        }
      }}
      tabIndex={0}
      role="link"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}
      title={isRTL ? `انقر للانتقال إلى صفحة ${HERO_SLIDES[currentSlide].wordAr}` : `Click banner to view ${HERO_SLIDES[currentSlide].wordEn}`}
      aria-label={isRTL ? 'القسم الرئيسي لخدمات جوزاء - انقر لفتح تفاصيل الخدمة' : 'Jawzaa Main Hero Banner - Click to open service'}
    >
      {/* Background moving banners container */}
      <div className="hero-video-bg-container hero-slides-viewport" aria-hidden="true">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide-item ${idx === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              className="hero-contained-background hero-moving-banner-img"
              alt=""
              width="1920"
              height="1080"
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
          </div>
        ))}
        <div className="hero-ambient-glow" />
        <div className="hero-video-overlay" />
        <div className="hero-bottom-shadow-gradient" />
      </div>

      {/* Main Hero Content (Exact layout, alignment and animation as Image 1) */}
      <div className="container hero-video-content-container hero-editorial-content">
        <div className="hero-top-trust-pill hero-intro-item">
          <span className="live-ping-dot" />
          <span>
            {isRTL
              ? 'المركز الهندسي المعتمد لصيانة التكييف والأجهزة المنزلية بالرياض'
              : 'Certified Engineering Center for HVAC & Appliance Repair in Riyadh'}
          </span>
        </div>

        <h1 className="hero-cinema-h1 hero-intro-item">
          <span className="headline-tagline">
            {isRTL ? 'نحن نفحص بدقة • نصلح بإتقان • نضمن 100%' : 'WE DIAGNOSE. WE REPAIR. WE GUARANTEE.'}
          </span>
          <span className="headline-gold-gradient">
            {isRTL ? 'صيانة هندسية معتمدة لـ' : 'Expert Repair & Maintenance for'}
          </span>
          <span className="hero-slide-heading">{isRTL ? HERO_SLIDES[currentSlide].wordAr : HERO_SLIDES[currentSlide].wordEn}</span>
          <span className="headline-city-sub">
            {isRTL ? 'في جميع أحياء الرياض بضمان معتمد' : 'Across All Riyadh Districts with Official Warranty'}
          </span>
          <span className="visually-hidden">
            {HERO_SLIDES.map((s) => (isRTL ? s.wordAr : s.wordEn)).join(', ')}
          </span>
        </h1>

        <p className="hero-cinema-lead hero-intro-item">
          {isRTL
            ? 'فنيون معتمدون مجهزون بأحدث أجهزة الفحص الرقمية وكشف تسريب الفريون • خدمة منزلية سريعة بنفس اليوم • قطع غيار أصلية بضمان خطي معتمد وأسعار شفافة محددة مسبقاً.'
            : 'From HVAC & refrigeration fixes to complete equipment overhauls — our licensed technicians deliver quality workmanship, on time and within budget. Serving residential and commercial clients across Riyadh.'}
        </p>
        <button
          type="button"
          className="btn btn-gold hero-details-button"
          onClick={(e) => {
            e.stopPropagation();
            handleBannerClick();
          }}
        >
          {isRTL ? 'اكتشف الخدمة' : 'Explore This Service'}
        </button>
      </div>
      <div className="hero-slide-dots" aria-label={isRTL ? 'اختيار البانر' : 'Choose a banner'}>
        {HERO_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={index === currentSlide ? 'active' : ''}
            aria-label={isRTL ? slide.wordAr : slide.wordEn}
            aria-pressed={index === currentSlide}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentSlide(index);
            }}
          />
        ))}
      </div>
    </section>
  );
}
