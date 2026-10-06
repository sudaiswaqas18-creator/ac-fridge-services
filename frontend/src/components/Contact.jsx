import React, { useState } from 'react';
import { BRAND, waLink, T } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import { API_BASE } from '../config.js';

export function Contact() {
  const { lang, isRTL } = useLanguage();
  const { saveInquiry } = useData();
  const t = T[lang].contactSec;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    service: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const serviceName = formData.service || (isRTL ? 'صيانة عامة' : 'General Maintenance');

    // 1. Save to Dynamic DataContext & LocalStorage
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      area: formData.area || (isRTL ? 'الرياض' : 'Riyadh'),
      service: serviceName,
      notes: formData.notes || '',
      date: new Date().toLocaleString(isRTL ? 'ar-SA' : 'en-US'),
      status: 'new',
    };
    saveInquiry(newInquiry);

    // 2. Sync to Backend API
    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInquiry),
    }).catch(() => {});

    // 3. Open WhatsApp for instant dispatch
    const msg = isRTL
      ? `طلب صيانة جديد من موقع جوزاء:\n👤 الاسم: ${formData.name}\n📱 الجوال: ${formData.phone}\n📍 الحي: ${formData.area || 'الرياض'}\n🛠️ الخدمة: ${serviceName}\n📝 تفاصيل العطل: ${formData.notes || 'لا توجد'}`
      : `New Maintenance Request from Jawzaa Website:\n👤 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n📍 Area: ${formData.area || 'Riyadh'}\n🛠️ Service: ${serviceName}\n📝 Malfunction Details: ${formData.notes || 'None'}`;

    window.open(waLink(msg), '_blank', 'noopener');
    setSubmitted(true);
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.phone}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="contact-layout-grid">
          {/* Left / Right Contact Info Cards */}
          <div className="contact-info-cards-column">
            <a
              className="contact-info-card"
              href={waLink(isRTL ? 'السلام عليكم، أرغب بطلب فني صيانة عبر واتساب' : 'Hello, I want to book a technician via WhatsApp')}
              target="_blank"
              rel="noopener"
            >
              <div className="ci-icon-box wa-box">{I.whatsapp}</div>
              <div className="ci-body">
                <h4 className="ci-title">{t.waCardTitle}</h4>
                <p className="ci-desc">{t.waCardDesc}</p>
                <span className="ci-value" dir="ltr">{BRAND.phonePrimaryIntl}</span>
              </div>
            </a>

            <a className="contact-info-card" href={`tel:${BRAND.phonePrimaryIntl}`}>
              <div className="ci-icon-box phone-box">{I.phone}</div>
              <div className="ci-body">
                <h4 className="ci-title">{t.callCardTitle}</h4>
                <p className="ci-desc">{t.callCardDesc}</p>
                <span className="ci-value" dir="ltr">{BRAND.phonePrimary} / {BRAND.phoneSecondary}</span>
              </div>
            </a>

            <div className="contact-info-card static-card">
              <div className="ci-icon-box clock-box">{I.clock}</div>
              <div className="ci-body">
                <h4 className="ci-title">{t.hoursCardTitle}</h4>
                <p className="ci-desc">{isRTL ? BRAND.hoursAr : BRAND.hoursEn}</p>
                <span className="ci-status-badge">
                  <span className="live-dot-green" />
                  {isRTL ? 'خدمة يومية بلا انقطاع' : 'Open 7 Days a Week'}
                </span>
              </div>
            </div>

            <div className="contact-info-card static-card">
              <div className="ci-icon-box pin-box">{I.pin}</div>
              <div className="ci-body">
                <h4 className="ci-title">{t.locCardTitle}</h4>
                <p className="ci-desc">{isRTL ? BRAND.cityAr : BRAND.cityEn}</p>
                <span className="ci-note">{isRTL ? 'نصل إلى موقعك في نفس اليوم' : 'Same-day on-site service'}</span>
              </div>
            </div>
          </div>

          {/* Right / Left Form Column */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              <div className="form-card-header">
                <h3 className="cf-heading">{t.formHeading}</h3>
                <p className="cf-desc">{t.formDesc}</p>
              </div>

              <form onSubmit={handleSubmit} className="cf-form">
                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="cf-name">{isRTL ? 'الاسم الكريم' : 'Your Name'}</label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      placeholder={isRTL ? 'مثال: سالم القحطاني' : 'e.g. Salem Al-Qahtani'}
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cf-phone">{isRTL ? 'رقم الجوال' : 'Phone Number'}</label>
                    <input
                      id="cf-phone"
                      name="phone"
                      type="tel"
                      placeholder="05xxxxxxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label htmlFor="cf-area">{isRTL ? 'الحي بالرياض' : 'Riyadh District'}</label>
                    <input
                      id="cf-area"
                      name="area"
                      type="text"
                      placeholder={isRTL ? 'مثال: حي الروضة' : 'e.g. Al-Rawdah District'}
                      value={formData.area}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cf-service">{isRTL ? 'نوع الخدمة' : 'Service Type'}</label>
                    <select
                      id="cf-service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        {isRTL ? 'اختر الخدمة المطلوبة...' : 'Select service...'}
                      </option>
                      {isRTL ? (
                        <>
                          <option value="صيانة وتنظيف مكيفات سبليت">صيانة وتنظيف مكيفات سبليت</option>
                          <option value="شحن فريون أصلي وكشف تسريب">شحن فريون أصلي وكشف تسريب</option>
                          <option value="صيانة تكييف مركزي ومخفي">صيانة تكييف مركزي ومخفي</option>
                          <option value="تصليح ثلاجة أو فريزر منزلي">تصليح ثلاجة أو فريزر منزلي</option>
                          <option value="صيانة غسالة أو نشافة أوتوماتيك">صيانة غسالة أو نشافة أوتوماتيك</option>
                          <option value="لف وإصلاح موتور ومضخة مياه">لف وإصلاح موتور ومضخة مياه</option>
                          <option value="فحص شامل وتشخيص عطل">فحص شامل وتشخيص عطل</option>
                          <option value="عقد صيانة سنوي">عقد صيانة سنوي دوري</option>
                        </>
                      ) : (
                        <>
                          <option value="Split AC Service & Cleaning">Split AC Service & Cleaning</option>
                          <option value="Freon Gas Refill & Leak Check">Freon Gas Refill & Leak Check</option>
                          <option value="Central & Ducted HVAC Repair">Central & Ducted HVAC Repair</option>
                          <option value="Refrigerator & Freezer Repair">Refrigerator & Freezer Repair</option>
                          <option value="Automatic Washer & Dryer Repair">Automatic Washer & Dryer Repair</option>
                          <option value="Pure Copper Motor Rewinding">Pure Copper Motor Rewinding</option>
                          <option value="Comprehensive Diagnostics">Comprehensive Diagnostics</option>
                          <option value="Annual Maintenance Contract">Annual Maintenance Contract</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="cf-notes">{isRTL ? 'تفاصيل العطل أو المشكلة' : 'Issue Description'}</label>
                  <textarea
                    id="cf-notes"
                    name="notes"
                    placeholder={isRTL ? 'اكتب وصفاً مختصراً للمشكلة أو نوع المكيف/الجهاز...' : 'Describe the problem or brand/model of appliance...'}
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

                <button className="btn btn-wa btn-contact-submit" type="submit">
                  {I.whatsapp}
                  <span>{isRTL ? 'إرسال الطلب وحجز الفني فوراً' : 'Submit Request & Dispatch Technician'}</span>
                </button>

                {submitted && (
                  <div className="form-success-banner">
                    <span className="success-icon">{I.check}</span>
                    <span>
                      {isRTL
                        ? 'تم تجهيز رسالتك! اضغط إرسال في واتساب وسنرد عليك خلال لحظات.'
                        : 'Your request is ready! Tap Send in WhatsApp and we will respond instantly.'}
                    </span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Interactive Google Maps Location Showcase */}
        <div className="contact-map-wrapper" style={{ marginTop: '48px' }}>
          <div
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>{I.pin}</span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy-950)' }}>
                    {isRTL ? 'موقع ورشة ومعرض جوزاء للتبريد والتكييف' : 'Jawzaa HVAC Workshop & Showroom Location'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {isRTL
                    ? 'الرياض، المملكة العربية السعودية — نخدم ونغطي كافة أحياء العاصمة مع ورشة صيانة متكاملة.'
                    : 'Riyadh, Kingdom of Saudi Arabia — Full on-site service covering all Riyadh districts.'}
                </p>
              </div>

              <a
                href="https://maps.app.goo.gl/WDg2itdrGeQ81SE99?g_st=aw"
                target="_blank"
                rel="noopener"
                className="btn btn-navy"
                style={{ fontSize: '0.9rem', padding: '10px 20px' }}
              >
                <span>{I.pin}</span>
                <span>{isRTL ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}</span>
                <span>{I.arrowR}</span>
              </a>
            </div>

            <div
              className="map-embed-container"
              style={{
                width: '100%',
                height: '380px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
              }}
            >
              <iframe
                title={isRTL ? 'موقع جوزاء للتبريد والتكييف بالرياض' : 'Jawzaa HVAC Riyadh Location'}
                src="https://maps.google.com/maps?q=%D8%AA%D8%A8%D8%B1%D9%8A%D8%AF%20%D9%88%D8%AA%D9%83%D9%8A%D9%8A%D9%81%20%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
