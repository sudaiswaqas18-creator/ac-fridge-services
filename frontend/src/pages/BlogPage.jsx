import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../content/siteData.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { I } from '../Icons.jsx';
import CompanySectionNav from '../components/CompanySectionNav.jsx';

const mediaGlob = import.meta.glob(['../assets/media/*.webp'], { eager: true, import: 'default' });
const getMediaUrl = name => mediaGlob[`../assets/media/${name}.webp`];

export default function BlogPage() {
  const { isRTL } = useLanguage();
  const { posts } = useData();

  return (
    <div className="blog-page-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner blog-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.snow}</span>
            {isRTL ? 'دليل الصيانة والمقالات التوعوية' : 'HVAC & Appliance Knowledge Base'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'نصائح مهنية وإرشادات للحفاظ على أجهزتك' : 'Expert Appliance Guides & Energy-Saving Advice'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'مقالات وإرشادات عملية أعدها مهندسو وفنيو جوزاء لمساعدتك في خفض فاتورة الكهرباء وتجنب الأعطال المفاجئة.'
              : 'Actionable maintenance articles curated by Jawzaa technicians to help you lower electric bills and prevent breakdown.'}
          </p>
        </div>
      </section>
      <CompanySectionNav />

      {/* Blog Posts Grid */}
      <section className="blog-listing-section">
        <div className="container">
          <div className="blog-posts-grid">
            {posts.map(post => {
              const title = isRTL ? post.titleAr : post.titleEn;
              const excerpt = isRTL ? post.excerptAr : post.excerptEn;
              const cat = isRTL ? post.categoryAr : post.categoryEn;
              const readTime = isRTL ? post.readTimeAr : post.readTimeEn;
              const img = getMediaUrl(post.image);

              return (
                <article className="blog-card-item" key={post.slug}>
                  <div className="blog-card-img-wrap">
                    <img src={img} alt={title} className="blog-card-img" loading="lazy" decoding="async" />
                    <span className="blog-cat-pill">{cat}</span>
                  </div>

                  <div className="blog-card-body">
                    <div className="blog-meta-row">
                      <span className="meta-date">{post.date}</span>
                      <span className="meta-sep">•</span>
                      <span className="meta-read-time">{readTime}</span>
                    </div>

                    <h2 className="blog-card-title">
                      <Link to={`/blog/${post.slug}`}>{title}</Link>
                    </h2>

                    <p className="blog-card-excerpt">{excerpt}</p>

                    <Link to={`/blog/${post.slug}`} className="blog-read-link">
                      <span>{isRTL ? 'قراءة المقال كاملاً' : 'Read Full Article'}</span>
                      <span>{isRTL ? I.arrowL : I.arrowR}</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
