import React, { useState } from 'react';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import CompanySectionNav from '../components/CompanySectionNav.jsx';

export default function FaqPage() {
  const { isRTL } = useLanguage();
  const { faqs } = useData();
  const [openIdx, setOpenIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => {
    const q = isRTL ? faq.qAr : faq.qEn;
    const a = isRTL ? faq.aAr : faq.aEn;
    return q.toLowerCase().includes(searchQuery.toLowerCase()) || a.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="faq-page-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner faq-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.diagnosis}</span>
            {isRTL ? 'مركز الإجابات والأسئلة الشائعة' : 'FAQ & Knowledge Base'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'كل ما تحتاج لمعرفته حول خدماتنا وضماناتنا' : 'Everything You Need to Know About Our Services'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'إجابات واضحة وشفافة على كافة تساؤلات العملاء المتعلقة بأسعار الصيانة، مدد الضمان، وسرعة الاستجابة.'
              : 'Transparent answers regarding pricing, warranty duration, service times, and service protocols.'}
          </p>

          <div className="faq-search-bar-wrap">
            <input
              type="text"
              className="faq-search-input"
              placeholder={isRTL ? 'ابحث عن سؤالك هنا (مثال: فريون، ضمان، سعر)...' : 'Search your question here (e.g. freon, warranty, price)...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>
      <CompanySectionNav />

      {/* FAQs Main Section */}
      <section className="faq-main-section">
        <div className="container">
          <div className="faq-accordion-container">
            {filteredFaqs.length === 0 ? (
              <div className="no-faqs-found">
                <p>{isRTL ? 'لم نجد نتائج تطابق بحثك. تواصل معنا مباشرة للإجابة الفورية!' : 'No results matching your query. Contact us directly for immediate help!'}</p>
                <a className="btn btn-wa" href={waLink()} target="_blank" rel="noopener">
                  {I.whatsapp} {isRTL ? 'اسألنا عبر واتساب' : 'Ask via WhatsApp'}
                </a>
              </div>
            ) : (
              filteredFaqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                const q = isRTL ? faq.qAr : faq.qEn;
                const a = isRTL ? faq.aAr : faq.aEn;

                return (
                  <div className={`faq-accordion-item ${isOpen ? 'open' : ''}`} key={idx}>
                    <button
                      className="faq-question-btn"
                      onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-q-text">{q}</span>
                      <span className="faq-toggle-icon">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div className="faq-answer-collapse">
                      <p className="faq-answer-text">{a}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="faq-bottom-cta-card">
            <h3 className="faq-cta-title">{isRTL ? 'لم تجد إجابة على سؤالك؟' : 'Still Have Questions?'}</h3>
            <p className="faq-cta-sub">{isRTL ? 'فريق خدمة العملاء متاح من السبت إلى الخميس من 8 صباحاً وحتى 11:30 مساءً للإجابة على كافة استفساراتك.' : 'Our customer team is available Saturday to Thursday from 8 AM to 11:30 PM.'}</p>
            <div className="faq-cta-buttons">
              <a className="btn btn-wa" href={waLink()} target="_blank" rel="noopener">
                {I.whatsapp} {isRTL ? 'تحدث مع فني الآن' : 'Chat with a Technician'}
              </a>
              <a className="btn btn-gold-outline" href={`tel:${BRAND.phonePrimaryIntl}`}>
                {I.phone} <span dir="ltr">{BRAND.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
