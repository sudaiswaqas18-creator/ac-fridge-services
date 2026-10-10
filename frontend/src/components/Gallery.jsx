import React, { useCallback, useEffect, useState } from 'react';
import { GALLERY_ITEMS, VIDEO_ITEMS } from '../data.js';
import { T } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

const mediaGlob = import.meta.glob(['../assets/media/*.webp', '!../assets/media/*washer*'], { eager: true, import: 'default' });
const getMediaUrl = name =>
  mediaGlob[`../assets/media/${name}.webp`] ||
  mediaGlob[`../assets/media/${name}`] ||
  name;

export function Gallery() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].gallerySec;
  const [activeTab, setActiveTab] = useState('all');
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const filteredItems = activeTab === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  const closeLightbox = useCallback(() => setLightboxIdx(-1), []);

  useEffect(() => {
    const handleKeyDown = e => {
      if (lightboxIdx < 0) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        setLightboxIdx(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === 'ArrowRight') {
        setLightboxIdx(prev => (prev + 1) % filteredItems.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIdx, filteredItems.length, closeLightbox]);

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.zoom}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="gallery-filter-tabs">
          <button
            className={`gallery-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t.tabs.all}
          </button>
          <button
            className={`gallery-tab-btn ${activeTab === 'ac' ? 'active' : ''}`}
            onClick={() => setActiveTab('ac')}
          >
            {t.tabs.ac}
          </button>
          <button
            className={`gallery-tab-btn ${activeTab === 'fridge' ? 'active' : ''}`}
            onClick={() => setActiveTab('fridge')}
          >
            {t.tabs.fridge}
          </button>
          <button
            className={`gallery-tab-btn ${activeTab === 'workshop' ? 'active' : ''}`}
            onClick={() => setActiveTab('workshop')}
          >
            {t.tabs.workshop}
          </button>
        </div>

        <div className="gallery-cards-grid">
          {filteredItems.map((item, index) => {
            const imgSrc = getMediaUrl(item.src);
            const title = isRTL ? item.titleAr : item.titleEn;
            return (
              <div
                className="gallery-card-item"
                key={item.id}
                onClick={() => setLightboxIdx(index)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setLightboxIdx(index)}
                aria-label={title}
              >
                <div className="gallery-card-img-wrap">
                  <img
                    src={imgSrc}
                    alt={title}
                    loading="lazy"
                    width="600"
                    height="450"
                  />
                  <div className="gallery-card-overlay">
                    <span className="gallery-zoom-badge">
                      {I.zoom}
                      <span>{t.zoomTip}</span>
                    </span>
                  </div>
                </div>
                <div className="gallery-card-caption">
                  <span className="caption-cat-pill">
                    {t.tabs[item.category] || t.tabs.all}
                  </span>
                  <h4 className="caption-text">{title}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {lightboxIdx >= 0 && filteredItems[lightboxIdx] && (
        <div className="lightbox-modal-backdrop" onClick={closeLightbox}>
          <div
            className="lightbox-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="lightbox-close-btn"
              onClick={closeLightbox}
              aria-label="Close"
            >
              {I.close}
            </button>

            <button
              className="lightbox-nav-btn prev-btn"
              onClick={() =>
                setLightboxIdx(
                  prev => (prev - 1 + filteredItems.length) % filteredItems.length
                )
              }
              aria-label="Previous"
            >
              {isRTL ? I.arrowR : I.arrowL}
            </button>

            <div className="lightbox-image-container">
              <img
                src={getMediaUrl(filteredItems[lightboxIdx].src)}
                alt={isRTL ? filteredItems[lightboxIdx].titleAr : filteredItems[lightboxIdx].titleEn}
              />
              <div className="lightbox-caption-bar">
                <span className="lightbox-counter">
                  {lightboxIdx + 1} / {filteredItems.length}
                </span>
                <span className="lightbox-title-text">
                  {isRTL ? filteredItems[lightboxIdx].titleAr : filteredItems[lightboxIdx].titleEn}
                </span>
              </div>
            </div>

            <button
              className="lightbox-nav-btn next-btn"
              onClick={() =>
                setLightboxIdx(prev => (prev + 1) % filteredItems.length)
              }
              aria-label="Next"
            >
              {isRTL ? I.arrowL : I.arrowR}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export function VideosSection() {
  const { lang, isRTL } = useLanguage();
  const t = T[lang].videoSec;
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <section className="videos-section" id="videos">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.play}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="videos-cards-grid">
          {VIDEO_ITEMS.map(video => {
            const title = isRTL ? video.titleAr : video.titleEn;
            const cat = isRTL ? video.categoryAr : video.categoryEn;

            return (
              <div
                className="video-showcase-card"
                key={video.id}
                onClick={() => setSelectedVideo(video)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedVideo(video)}
              >
                <div className="video-poster-wrapper">
                  <img
                    src={video.poster}
                    alt={title}
                    className="video-poster-img"
                    loading="lazy"
                  />
                  <div className="video-play-overlay">
                    <div className="video-play-btn-circle">
                      <span className="play-triangle">{I.play}</span>
                    </div>
                  </div>
                  <span className="video-duration-pill">{video.duration}</span>
                  <span className="video-cat-badge">{cat}</span>
                </div>

                <div className="video-card-info">
                  <h4 className="video-card-title">{title}</h4>
                  <div className="video-play-action-text">
                    <span className="mini-play-icon">{I.play}</span>
                    <span>{t.watchBtn}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedVideo && (
        <div
          className="video-modal-backdrop"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="video-modal-dialog"
            onClick={e => e.stopPropagation()}
          >
            <div className="video-modal-header">
              <h4 className="video-modal-title">
                {isRTL ? selectedVideo.titleAr : selectedVideo.titleEn}
              </h4>
              <button
                className="video-modal-close"
                onClick={() => setSelectedVideo(null)}
                aria-label={t.modalClose}
              >
                {I.close}
              </button>
            </div>
            <div className="video-player-frame">
              <video
                src={selectedVideo.src}
                poster={selectedVideo.poster}
                controls
                autoPlay
                playsInline
                className="modal-video-element"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Process() {
  const { lang } = useLanguage();
  const t = T[lang].processSec;

  return (
    <section className="process-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">
            <span className="tag-icon">{I.bolt}</span>
            {t.tag}
          </span>
          <h2 className="section-title">{t.title}</h2>
          <p className="section-subtitle">{t.sub}</p>
          <div className="section-divider" />
        </div>

        <div className="process-steps-grid">
          {t.steps.map((step, idx) => (
            <div className="process-step-card" key={idx}>
              <div className="step-number-bubble">
                <span>{step.num}</span>
              </div>
              <h3 className="step-card-title">{step.title}</h3>
              <p className="step-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
