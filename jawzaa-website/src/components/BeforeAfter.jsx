import React, { useCallback, useRef, useState } from 'react';
import { T } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import beforeImg from '../assets/media/ba-before.webp';
import afterImg from '../assets/media/ba-after.webp';

export default function BeforeAfter() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].baSec;
  const [position, setPosition] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMove = useCallback(
    clientX => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      let percent = ((clientX - rect.left) / rect.width) * 100;
      percent = Math.min(96, Math.max(4, percent));
      setPosition(percent);
    },
    []
  );

  const onMouseDown = e => {
    isDragging.current = true;
    handleMove(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onMouseMove = e => {
    if (!isDragging.current) return;
    handleMove(e.touches ? e.touches[0].clientX : e.clientX);
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <section className="ba-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag light-tag">
            <span className="tag-icon">{I.bolt}</span>
            {t.tag}
          </span>
          <h2 className="section-title text-white">{t.title}</h2>
          <p className="section-subtitle text-light">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="ba-content-grid">
          <div className="ba-slider-wrapper">
            <div
              className="ba-interactive-slider"
              ref={containerRef}
              style={{ '--slider-pos': `${position}%` }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              onTouchStart={onMouseDown}
              onTouchMove={onMouseMove}
              onTouchEnd={onMouseUp}
              role="slider"
              aria-label="Before and After Comparison"
              aria-valuenow={Math.round(position)}
              tabIndex={0}
            >
              <img
                src={beforeImg}
                alt="Motor before repair"
                className="ba-img ba-before-img"
                draggable="false"
              />
              <img
                src={afterImg}
                alt="Motor after rewinding"
                className="ba-img ba-after-img"
                draggable="false"
              />

              <div className="ba-label ba-label-before">{t.beforeLabel}</div>
              <div className="ba-label ba-label-after">{t.afterLabel}</div>

              <div className="ba-divider-handle">
                <div className="ba-handle-knob">
                  <span className="knob-icon">{I.drag}</span>
                </div>
              </div>
            </div>
            <p className="ba-tip-note">
              <span>{I.drag}</span>
              <span>{isRTL ? 'اسحب الشريط لمقارنة نتيجة إعادة اللف' : 'Drag the slider to compare rewinding results'}</span>
            </p>
          </div>

          <div className="ba-details-card">
            <h3 className="ba-card-title">{t.cardTitle}</h3>
            <p className="ba-card-text">{t.cardText}</p>

            <ul className="ba-points-list">
              {t.points.map((point, index) => (
                <li key={index}>
                  <span className="point-check-icon">{I.check}</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
