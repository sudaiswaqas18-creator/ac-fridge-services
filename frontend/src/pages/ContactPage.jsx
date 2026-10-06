import React from 'react';
import { Contact } from '../components/Contact.jsx';
import { Areas, Faq } from '../components/Reviews.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

export default function ContactPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="contact-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.phone}</span>
            {isRTL ? 'حجز فوري واستفسارات' : 'Direct Booking & Support'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'تواصل مع فريق صيانة جوزاء بالرياض' : 'Get in Touch with Jawzaa Service Team'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'احجز موعد صيانة منزلي فوري عبر واتساب أو الاتصال المباشر. نصل إليك أينما كنت في مدينة الرياض.'
              : 'Book an on-site technician via WhatsApp or direct phone call. Fast same-day service across Riyadh.'}
          </p>
        </div>
      </section>

      <Contact />
      <Areas />
      <Faq />
    </div>
  );
}
