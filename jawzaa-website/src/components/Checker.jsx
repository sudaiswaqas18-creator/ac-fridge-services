import React, { useState } from 'react';
import { T, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

export default function Checker() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].checkerSec;
  const symptoms = T[lang].symptomsList;

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filterCat, setFilterCat] = useState('ALL');

  const categories = isRTL
    ? [
        { id: 'ALL', label: 'جميع الأعطال' },
        { id: 'المكيفات', label: 'المكيفات' },
        { id: 'الثلاجات', label: 'الثلاجات' },
        { id: 'الغسالات', label: 'الغسالات' },
        { id: 'الموتورات والمركات', label: 'الموتورات' },
      ]
    : [
        { id: 'ALL', label: 'All Malfunctions' },
        { id: 'Air Conditioners', label: 'Air Conditioners' },
        { id: 'Refrigerators', label: 'Refrigerators' },
        { id: 'Washing Machines', label: 'Washing Machines' },
        { id: 'Motors & Pumps', label: 'Motors & Pumps' },
      ];

  const filteredSymptoms = filterCat === 'ALL'
    ? symptoms
    : symptoms.filter(s => s.category === filterCat);

  const activeSymptom = symptoms[selectedIdx] || symptoms[0];

  return (
    <section className="checker-section" id="checker">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.diagnosis}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="checker-cat-tabs">
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab-btn ${filterCat === cat.id ? 'active' : ''}`}
              onClick={() => {
                setFilterCat(cat.id);
                const firstMatch = symptoms.findIndex(
                  s => cat.id === 'ALL' || s.category === cat.id
                );
                if (firstMatch !== -1) setSelectedIdx(firstMatch);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="checker-layout-grid">
          <div className="checker-symptoms-column">
            {filteredSymptoms.map((symptom, idx) => {
              const originalIndex = symptoms.indexOf(symptom);
              const isActive = originalIndex === selectedIdx;
              return (
                <button
                  key={originalIndex}
                  className={`symptom-card-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedIdx(originalIndex)}
                >
                  <span className="symptom-status-badge">
                    {isActive ? I.check : (isRTL ? '؟' : '?')}
                  </span>
                  <div className="symptom-btn-text">
                    <span className="symptom-category-pill">{symptom.category}</span>
                    <h4 className="symptom-btn-title">{symptom.problem}</h4>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="checker-solution-column">
            <div className="solution-card" key={`sol-${selectedIdx}`}>
              <div className="solution-top-badge-row">
                <span className="sol-badge-cat">{activeSymptom.category}</span>
                <span className="sol-badge-time">
                  <span className="time-icon">{I.clock}</span>
                  {activeSymptom.estTime}
                </span>
              </div>

              <h3 className="solution-main-title">{activeSymptom.problem}</h3>

              <div className="diagnostic-block cause-block">
                <div className="block-icon">{I.diagnosis}</div>
                <div className="block-body">
                  <h4 className="block-heading">{t.causeLabel}</h4>
                  <p className="block-text">{activeSymptom.cause}</p>
                </div>
              </div>

              <div className="diagnostic-block fix-block">
                <div className="block-icon">{I.tools}</div>
                <div className="block-body">
                  <h4 className="block-heading">{t.solutionLabel}</h4>
                  <p className="block-text">{activeSymptom.fix}</p>
                </div>
              </div>

              <div className="solution-action-row">
                <a
                  className="btn btn-gold btn-book-diagnostic"
                  href={waLink(
                    isRTL
                      ? `السلام عليكم، جهازي به هذا العطل: "${activeSymptom.problem}" وأحتاج فني صيانة لفحصه وإصلاحه.`
                      : `Hello, my appliance has this issue: "${activeSymptom.problem}" and I need a technician to inspect and fix it.`
                  )}
                  target="_blank"
                  rel="noopener"
                >
                  {I.whatsapp}
                  <span>{t.bookBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
