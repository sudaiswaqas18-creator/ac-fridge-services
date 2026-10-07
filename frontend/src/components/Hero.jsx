import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import heroBannerAc from '../assets/media/hero-banner-ac.jpg';
import heroBannerFridge from '../assets/media/hero-banner-fridge.jpg';
import heroBannerWasher from '../assets/media/hero-banner-washer.jpg';
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
    id: 'washer',
    image: heroBannerWasher,
    path: '/services/washing-machine-repair',
    wordEn: 'Automatic Washers & Dryers',
    wordAr: 'الغسالات والنشافات الأوتوماتيك',
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

  // Original GSAP rotating lines timeline & entrance animation
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray('.hero-rotating-line');
        gsap.set(lines, { autoAlpha: 0, y: 8 });
        const rotation = gsap.timeline({ repeat: -1 });

        lines.forEach((line, idx) => {
          rotation
            .to(line, {
              autoAlpha: 1,
              y: 0,
              duration: 0.3,
              ease: 'power2.out',
              onStart: () => setCurrentSlide(idx),
            })
            .to(
              line,
              {
                autoAlpha: 0,
                y: -8,
                duration: 0.3,
                ease: 'power2.in',
              },
              '+=2.6'
            )
            .set(line, { y: 18 });
        });

        gsap.from('.hero-intro-item', {
          opacity: 0,
          y: 22,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: document.querySelector('.jawzaa-splash-screen') ? 1.35 : 0,
          clearProps: 'opacity,transform',
        });
      }, heroRef);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [isRTL]);

  const handleBannerClick = () => {
    navigate(HERO_SLIDES[currentSlide].path);
  };

  return (
    <section
      ref={heroRef}
      className="hero-video-master centered-hero-master restored-hero hero-clickable-banner"
      id="home"
      onClick={handleBannerClick}
      title={isRTL ? `انقر للانتقال إلى صفحة الخدمة` : `Click to view service details`}
      aria-label={isRTL ? 'القسم الرئيسي لخدمات جوزاء' : 'Jawzaa Main Hero Banner'}
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
      <div className="container hero-video-content-container hero-centered-content">
        <div className="hero-top-trust-pill centered-pill hero-intro-item">
          <span className="live-ping-dot" />
          <span>
            {isRTL
              ? 'المركز الهندسي المعتمد لصيانة التكييف والأجهزة المنزلية بالرياض'
              : 'Certified Engineering Center for HVAC & Appliance Repair in Riyadh'}
          </span>
        </div>

        <h1 className="hero-cinema-h1 centered-h1 hero-intro-item">
          <span className="headline-tagline">
            {isRTL ? 'نحن نفحص بدقة • نصلح بإتقان • نضمن 100%' : 'WE DIAGNOSE. WE REPAIR. WE GUARANTEE.'}
          </span>
          <span className="headline-gold-gradient">
            {isRTL ? 'صيانة هندسية معتمدة لـ' : 'Expert Home Repair & Renovation for'}
          </span>
          <span className="hero-rotating-words" aria-hidden="true">
            {HERO_SLIDES.map((slide) => (
              <span key={`${isRTL}-${slide.id}`} className="hero-rotating-line">
                {isRTL ? slide.wordAr : slide.wordEn}
              </span>
            ))}
          </span>
          <span className="headline-city-sub">
            {isRTL ? 'في جميع أحياء الرياض بضمان معتمد' : 'Across All Riyadh Districts with Official Warranty'}
          </span>
          <span className="visually-hidden">
            {HERO_SLIDES.map((s) => (isRTL ? s.wordAr : s.wordEn)).join(', ')}
          </span>
        </h1>

        <p className="hero-cinema-lead centered-lead hero-intro-item">
          {isRTL
            ? 'فنيون معتمدون مجهزون بأحدث أجهزة الفحص الرقمية وكشف تسريب الفريون • خدمة منزلية سريعة بنفس اليوم • قطع غيار أصلية بضمان خطي معتمد وأسعار شفافة محددة مسبقاً.'
            : 'From HVAC & refrigeration fixes to complete equipment overhauls — our licensed technicians deliver quality workmanship, on time and within budget. Serving residential and commercial clients across Riyadh.'}
        </p>
      </div>
    </section>
  );
}
