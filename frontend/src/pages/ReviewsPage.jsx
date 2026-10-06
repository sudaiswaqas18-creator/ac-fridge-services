import React from 'react';
import { Reviews, Faq, Areas } from '../components/Reviews.jsx';
import { Features } from '../components/Services.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import CompanySectionNav from '../components/CompanySectionNav.jsx';

export default function ReviewsPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="reviews-page-view">
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.star}</span>
            {isRTL ? 'تقييمات العملاء والأسئلة' : 'Customer Reviews & FAQ'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'ماذا يقول عملاؤنا عن خدمات جوزاء؟' : 'What Our Customers Say About Jawzaa'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'تجارب واقعية لعملائنا في مختلف أحياء الرياض مع إجابات شاملة على كافة الأسئلة الشائعة حول خدماتنا وضماناتنا.'
              : 'Real customer feedback across Riyadh neighborhoods alongside answers to frequent questions about our warranties and repairs.'}
          </p>
        </div>
      </section>
      <CompanySectionNav />

      <Reviews />
      <Faq />
      <Features />
      <Areas />
    </div>
  );
}
