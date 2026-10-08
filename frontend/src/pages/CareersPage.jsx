import React, { useState } from 'react';
import { CAREERS_DATA } from '../content/siteData.js';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import CompanySectionNav from '../components/CompanySectionNav.jsx';

export default function CareersPage() {
  const { isRTL } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    experience: '',
    nationality: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const benefits = [
    {
      icon: 'wallet',
      titleAr: 'رواتب مجزية وحوافز شهرية',
      titleEn: 'Competitive Salary & Incentives',
      descAr: 'رواتب تنافسية ومكافآت شهرية مجزية بناءً على جودة العمل وتقييمات العملاء.',
      descEn: 'Competitive base pay plus monthly bonuses based on quality and ratings.',
    },
    {
      icon: 'shield',
      titleAr: 'تأمين طبي وإقامة نظامية',
      titleEn: 'Health Insurance & Legal Visa',
      descAr: 'تأمين صحي شامل، إقامة نظامية، وبيئة عمل قانونية ومريحة.',
      descEn: 'Full health insurance, legal residency sponsorship, and safe work environment.',
    },
    {
      icon: 'tools',
      titleAr: 'أحدث المعدات وسيارات الصيانة',
      titleEn: 'Modern Tools & Service Fleet',
      descAr: 'توفير أحدث أجهزة الفحص الرقمية وسيارات خدمة حديثة ومكيفة.',
      descEn: 'Equipped with digital diagnostic tools and modern air-conditioned service vans.',
    },
    {
      icon: 'star',
      titleAr: 'تطوير وتدريب مهني مستمر',
      titleEn: 'Ongoing Skill Training',
      descAr: 'دورات تدريبية دورية على أحدث أجهزة التكييف والإنفرتر والتحكم الذكي.',
      descEn: 'Continuous training on inverter technologies and smart commercial HVAC.',
    },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    const msg = isRTL
      ? `طلب تقديم على وظيفة في جوزاء:\n👤 الاسم: ${formData.name}\n📱 الجوال: ${formData.phone}\n🛠️ الوظيفة: ${formData.role}\n📅 سنوات الخبرة: ${formData.experience}\n🌍 الجنسية: ${formData.nationality}`
      : `Job Application for Jawzaa Team:\n👤 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n🛠️ Position: ${formData.role}\n📅 Years Exp: ${formData.experience}\n🌍 Nationality: ${formData.nationality}`;

    window.open(waLink(msg), '_blank', 'noopener');
    setSubmitted(true);
  };

  return (
    <div className="careers-page-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner careers-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.userCheck}</span>
            {isRTL ? 'انضم إلى فريق جوزاء بالرياض' : 'Join Jawzaa Professional Team'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'وظائف فنية وهندسية شاغرة في التبريد والتكييف' : 'Open HVAC & Electromechanical Career Opportunities'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'نبحث دائماً عن الكفاءات الفنية المتميزة للانضمام إلى عائلة جوزاء، مع بيئة عمل محفزة ومكافآت مجزية.'
              : 'We are continually seeking skilled HVAC and electrical technicians to grow with our leading enterprise in Riyadh.'}
          </p>
        </div>
      </section>
      <CompanySectionNav />

      {/* Benefits */}
      <section className="careers-benefits-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <span className="tag-icon">{I.star}</span>
              {isRTL ? 'لماذا تعمل معنا؟' : 'Why Work With Us?'}
            </span>
            <h2 className="section-title">{isRTL ? 'مزايا وبيئة العمل في مؤسسة جوزاء' : 'Employee Benefits & Workplace Culture'}</h2>
            <div className="section-divider" />
          </div>

          <div className="careers-benefits-grid">
            {benefits.map((b, idx) => (
              <div className="career-benefit-card" key={idx}>
                <div className="cb-icon-wrap">{I[b.icon] || I.shield}</div>
                <h3 className="cb-title">{isRTL ? b.titleAr : b.titleEn}</h3>
                <p className="cb-desc">{isRTL ? b.descAr : b.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions & Application Form */}
      <section className="careers-jobs-section">
        <div className="container careers-layout-grid">
          {/* Positions List */}
          <div className="careers-jobs-col">
            <h2 className="jobs-section-heading">{isRTL ? 'الوظائف الشاغرة حالياً' : 'Current Open Positions'}</h2>
            <div className="job-cards-list">
              {CAREERS_DATA.map(job => (
                <div className="job-listing-card" key={job.id}>
                  <div className="job-card-top-row">
                    <h3 className="job-title">{isRTL ? job.titleAr : job.titleEn}</h3>
                    <span className="job-type-pill">{isRTL ? job.typeAr : job.typeEn}</span>
                  </div>
                  <div className="job-exp-tag">
                    <span className="exp-icon">{I.tools}</span>
                    <span>{isRTL ? job.experienceAr : job.experienceEn}</span>
                  </div>
                  <p className="job-description">{isRTL ? job.descAr : job.descEn}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Apply Form */}
          <div className="careers-form-col">
            <div className="career-apply-card">
              <h3 className="apply-card-title">{isRTL ? 'نموذج التقديم السريع' : 'Quick Application Form'}</h3>
              <p className="apply-card-sub">{isRTL ? 'سجل بياناتك وسيتم التواصل معك لترتيب المقابلة الفنية.' : 'Submit your details and our HR team will contact you.'}</p>

              <form onSubmit={handleSubmit} className="apply-form-body">
                <div className="form-field">
                  <label htmlFor="career-name">{isRTL ? 'الاسم الكامل' : 'Full Name'}</label>
                  <input
                    type="text"
                    required
                    placeholder={isRTL ? 'مثال: سليم أحمد' : 'e.g. Saleem Ahmed'}
                    id="career-name"
                    name="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="career-phone">{isRTL ? 'رقم الجوال / واتساب' : 'Phone / WhatsApp'}</label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="05xxxxxxxx"
                    id="career-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="career-role">{isRTL ? 'الوظيفة المطلوبة' : 'Applying For Position'}</label>
                  <select
                    required
                    id="career-role"
                    name="role"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="" disabled>{isRTL ? 'اختر الوظيفة...' : 'Select position...'}</option>
                    {CAREERS_DATA.map(j => (
                      <option key={j.id} value={isRTL ? j.titleAr : j.titleEn}>
                        {isRTL ? j.titleAr : j.titleEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="career-experience">{isRTL ? 'سنوات الخبرة' : 'Years Experience'}</label>
                    <input
                      type="text"
                      required
                      placeholder={isRTL ? 'مثال: 5 سنوات' : 'e.g. 5 Years'}
                      id="career-experience"
                    name="experience"
                    value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="career-nationality">{isRTL ? 'الجنسية' : 'Nationality'}</label>
                    <input
                      type="text"
                      required
                      placeholder={isRTL ? 'مثال: مصري، هندي...' : 'e.g. Egyptian, Indian...'}
                      id="career-nationality"
                    name="nationality"
                    value={formData.nationality}
                      onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-gold btn-apply-submit">
                  {I.whatsapp} {isRTL ? 'إرسال طلب التقديم' : 'Submit Application'}
                </button>

                {submitted && (
                  <div className="form-success-banner" role="status">
                    <span className="success-icon">{I.check}</span>
                    <span>{isRTL ? 'تم تجهيز طلبك! اضغط إرسال في واتساب للتأكيد.' : 'Application prepared! Tap send in WhatsApp to submit.'}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
