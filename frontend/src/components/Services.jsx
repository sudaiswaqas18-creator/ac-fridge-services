import CardCarousel from './CardCarousel.jsx';
import React from 'react';
import { Link } from 'react-router-dom';
import { T, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useCountUp } from '../hooks.js';
import { I } from '../Icons.jsx';

const ICONS_MAP = {
  ac: I.ac,
  fridge: I.fridge,
  motor: I.motor,
  diagnosis: I.diagnosis,
  contract: I.contract,
};

const FEAT_ICONS_MAP = {
  clock: I.clock,
  shield: I.shield,
  wallet: I.wallet,
  tools: I.tools,
  parts: I.parts,
  home: I.home,
};

const SERVICE_SLUG_MAP = {
  'ac-repair': 'ac-repair',
  'fridge-repair': 'refrigerator-repair',
  'motor-rewind': 'motor-rewinding',
  'diagnosis': 'fault-diagnostics',
  'contracts': 'maintenance-contracts',
};

function StatCard({ num, suffix, label }) {
  const [ref, val] = useCountUp(num, 1800);
  const { isRTL } = useLanguage();
  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-number">
        {val.toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export function Marquee() {
  const { lang } = useLanguage();
  const items = T[lang].marquee;
  const repeated = [...items, ...items];
  return (
    <div className="marquee-bar" aria-hidden="true">
      <div className="marquee-track">
        {repeated.map((item, idx) => (
          <span key={idx} className="marquee-item">
            <span className="marquee-icon">{I.snow}</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  const { lang } = useLanguage();
  const statsList = T[lang].stats;
  return (
    <section className="stats-section">
      <div className="container stats-container">
        {statsList.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>
    </section>
  );
}

export function Services() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].servicesSec;
  const services = T[lang].servicesList;

  return (
    <section className="services-section" id="services-overview">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.tools}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <CardCarousel className="services-carousel" label={isRTL ? 'خدماتنا' : 'Our services'}>
          {services.map(svc => {
            const detailSlug = SERVICE_SLUG_MAP[svc.id] || svc.id;
            return (
              <article className="service-card" key={svc.id}>
                <div className="service-card-top">
                  <div className="service-icon-box">
                    {ICONS_MAP[svc.icon] || I.tools}
                  </div>
                  <span className="service-badge">{svc.badge}</span>
                </div>

                <h3 className="service-title">
                  <Link to={`/services/${detailSlug}`}>{svc.title}</Link>
                </h3>
                <p className="service-desc">{svc.desc}</p>

                <ul className="service-feature-list">
                  {svc.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="check-icon">{I.check}</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-card-footer">
                  <Link
                    to={`/services/${detailSlug}`}
                    className="btn btn-service-book"
                  >
                    <span>{isRTL ? 'تفاصيل الخدمة والباقات' : 'View Service & Pricing'}</span>
                    <span>{isRTL ? I.arrowL : I.arrowR}</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </CardCarousel>
      </div>
    </section>
  );
}

export function Features() {
  const { lang } = useLanguage();
  const t = T[lang].featuresSec;
  const features = T[lang].featuresList;

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.star}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="features-grid-container">
          {features.map((feat, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon-wrap">
                {FEAT_ICONS_MAP[feat.icon] || I.shield}
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
