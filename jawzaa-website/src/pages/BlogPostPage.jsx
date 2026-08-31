import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { BLOG_POSTS } from '../content/siteData.js';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

const mediaGlob = import.meta.glob('../assets/media/*.webp', { eager: true, import: 'default' });
const getMediaUrl = name => mediaGlob[`../assets/media/${name}.webp`];

export default function BlogPostPage() {
  const { postSlug } = useParams();
  const { isRTL } = useLanguage();

  const post = BLOG_POSTS.find(p => p.slug === postSlug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const title = isRTL ? post.titleAr : post.titleEn;
  const content = isRTL ? post.contentAr : post.contentEn;
  const cat = isRTL ? post.categoryAr : post.categoryEn;
  const readTime = isRTL ? post.readTimeAr : post.readTimeEn;
  const imgUrl = getMediaUrl(post.image);

  const otherPosts = BLOG_POSTS.filter(p => p.slug !== post.slug);

  return (
    <div className="blog-post-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <div className="service-breadcrumbs">
            <Link to="/">{isRTL ? 'الرئيسية' : 'Home'}</Link>
            <span>/</span>
            <Link to="/blog">{isRTL ? 'المدونة والمقالات' : 'Blog'}</Link>
            <span>/</span>
            <span className="current-crumb">{cat}</span>
          </div>

          <h1 className="subpage-hero-title">{title}</h1>
          <div className="post-header-meta">
            <span>{post.date}</span>
            <span>•</span>
            <span>{readTime}</span>
            <span>•</span>
            <span>{isRTL ? 'بقلم: فريق جوزاء الهندسي' : 'By: Jawzaa Engineering Team'}</span>
          </div>
        </div>
      </section>

      {/* Main Article Section */}
      <section className="blog-article-section">
        <div className="container blog-layout-grid">
          <div className="blog-main-column">
            {imgUrl && (
              <div className="blog-featured-img-frame">
                <img src={imgUrl} alt={title} className="blog-featured-img" />
              </div>
            )}

            <div className="blog-content-body">
              {content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('1.') || paragraph.startsWith('2.') || paragraph.startsWith('3.') || paragraph.startsWith('4.') || paragraph.startsWith('5.') || paragraph.startsWith('- ')) {
                  return (
                    <div className="article-list-block" key={idx}>
                      <p>{paragraph}</p>
                    </div>
                  );
                }
                return <p key={idx}>{paragraph}</p>;
              })}
            </div>

            {/* Author Card */}
            <div className="article-author-card">
              <div className="author-avatar-circle">
                <span>{isRTL ? 'ج' : 'J'}</span>
              </div>
              <div className="author-bio-text">
                <h4 className="author-card-name">{isRTL ? 'فريق جوزاء الهندسي بالرياض' : 'Jawzaa Engineering & Tech Editorial'}</h4>
                <p className="author-card-desc">
                  {isRTL
                    ? 'نخبة من المهندسين والفنيين المعتمدين المتخصصين في صيانة أجهزة التبريد والتكييف ولف الموتورات في المملكة العربية السعودية.'
                    : 'Certified mechanical and electrical engineers specializing in HVAC optimization, appliance repair, and motor rewinding in Saudi Arabia.'}
                </p>
              </div>
            </div>

            {/* Share / WhatsApp CTA Bar */}
            <div className="article-cta-box">
              <h3 className="art-cta-title">{isRTL ? 'هل تواجه هذا العطل في جهازك الآن؟' : 'Experiencing This Issue Right Now?'}</h3>
              <p className="art-cta-sub">{isRTL ? 'احجز فحصاً منزلياً فورياً وسنصل إليك في نفس اليوم.' : 'Book an on-site diagnostic visit with same-day dispatch.'}</p>
              <a className="btn btn-wa btn-art-wa" href={waLink()} target="_blank" rel="noopener">
                {I.whatsapp} {isRTL ? 'احجز فني عبر واتساب' : 'Book Technician on WhatsApp'}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar-column">
            <div className="sidebar-booking-card">
              <h3 className="sb-title">{isRTL ? 'صيانة منزلية سريعة' : 'Fast Home Service'}</h3>
              <p className="sb-desc">{isRTL ? 'نغطي كافة أحياء الرياض بفنيين معتمدين.' : 'Certified technicians covering all Riyadh.'}</p>
              <a className="btn btn-gold btn-sb-book" href={waLink()} target="_blank" rel="noopener">
                {I.whatsapp} {isRTL ? 'احجز موعدك الآن' : 'Book Service Now'}
              </a>
            </div>

            <div className="sidebar-links-card">
              <h4 className="sb-links-heading">{isRTL ? 'مقالات وإرشادات أخرى' : 'Related Articles'}</h4>
              <ul className="sb-links-list">
                {otherPosts.map(p => (
                  <li key={p.slug}>
                    <Link to={`/blog/${p.slug}`} className="sb-service-link">
                      <span>{isRTL ? p.titleAr : p.titleEn}</span>
                      <span>{isRTL ? '←' : '→'}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
