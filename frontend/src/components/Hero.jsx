import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLanguage } from '../context/LanguageContext.jsx';
import heroEnglishImg from '../assets/media/hero-hvac-english.webp';
import heroArabicImg from '../assets/media/hero-hvac-arabic.webp';

export default function Hero() {
  const { isRTL } = useLanguage();
  const heroRef = useRef(null);
  const words = isRTL
    ? ['المكيفات السبليت والشباك والمركزية', 'الثلاجات والفريزرات وغرف التبريد', 'الغسالات والنشافات الأوتوماتيك', 'لف موتورات ومضخات المياه بالنحاس النقي']
    : ['Split, Window & Ducted Central ACs', 'Refrigerators, Freezers & Cold Rooms', 'Automatic Washers & Dryers', 'Pure Copper Motor & Pump Rewinding'];

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const lines = gsap.utils.toArray('.hero-rotating-line');
        gsap.set(lines, { autoAlpha: 0, y: 8 });
        const rotation = gsap.timeline({ repeat: -1 });
        lines.forEach(line => {
          rotation.to(line, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' })
            .to(line, { autoAlpha: 0, y: -8, duration: 0.3, ease: 'power2.in' }, '+=2.6')
            .set(line, { y: 18 });
        });
        gsap.from('.hero-intro-item', {
          opacity: 0, y: 22, duration: 0.8, stagger: 0.12, ease: 'power3.out',
          delay: document.querySelector('.jawzaa-splash-screen') ? 1.35 : 0,
          clearProps: 'opacity,transform',
        });
      }, heroRef);
      return () => ctx.revert();
    });
    return () => media.revert();
  }, [isRTL]);

  return (
    <section ref={heroRef} className="hero-video-master centered-hero-master restored-hero" id="home">
      <div className="hero-video-bg-container" aria-hidden="true">
        <img src={isRTL ? heroArabicImg : heroEnglishImg} className="hero-contained-background"
          alt="" width="1376" height="768" fetchPriority="high" />
        <div className="hero-video-overlay" />
        <div className="hero-bottom-shadow-gradient" />
      </div>
      <div className="container hero-video-content-container hero-centered-content">
        <div className="hero-top-trust-pill centered-pill hero-intro-item">
          <span className="live-ping-dot" />
          <span>{isRTL ? 'المركز الهندسي المعتمد لصيانة التكييف والأجهزة المنزلية بالرياض' : 'Certified Engineering Center for HVAC & Appliance Repair in Riyadh'}</span>
        </div>
        <h1 className="hero-cinema-h1 centered-h1 hero-intro-item">
          <span className="headline-tagline">{isRTL ? 'نحن نفحص بدقة • نصلح بإتقان • نضمن 100%' : 'We Diagnose. We Repair. We Guarantee.'}</span>
          <br />
          <span className="headline-gold-gradient">{isRTL ? 'صيانة هندسية معتمدة لـ' : 'Expert Home Repair & Renovation for '}</span>
          <span className="hero-rotating-words" aria-hidden="true">
            {words.map((word, index) => <span key={`${isRTL}-${index}`} className="hero-rotating-line">{word}</span>)}
          </span>
          <span className="visually-hidden">{words.join(', ')}</span>
          <br />
          <span className="headline-city-sub">{isRTL ? 'في جميع أحياء الرياض بضمان معتمد' : 'Across All Riyadh Districts with Official Warranty'}</span>
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
