import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import { Footer, FloatActions } from './components/Layout.jsx';
import SiteMotion from './components/SiteMotion.jsx';
import SplashScreen from './components/SplashScreen.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage.jsx'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage.jsx'));
const CaseStudyDetailPage = lazy(() => import('./pages/CaseStudyDetailPage.jsx'));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage.jsx'));
const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'));
const WorkDetailPage = lazy(() => import('./pages/WorkDetailPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const FaqPage = lazy(() => import('./pages/FaqPage.jsx'));
const CareersPage = lazy(() => import('./pages/CareersPage.jsx'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'));
const TermsPage = lazy(() => import('./pages/TermsPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [pathname, hash]);

  return null;
}

// Website layout with header, footer, and float actions
function WebsiteLayout() {
  return (
    <div className="site-wrapper">
      <Header />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:caseId" element={<CaseStudyDetailPage />} />
          <Route path="/industries" element={<Navigate to="/services" replace />} />
          <Route path="/industries/*" element={<Navigate to="/services" replace />} />
          <Route path="/solutions" element={<Navigate to="/services" replace />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/work/:section" element={<WorkDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:postId" element={<BlogPostPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <FloatActions />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <>
      <SplashScreen />
      <div className="site-scroll-progress" aria-hidden="true" />
      <Suspense fallback={<div className="route-loading" role="status">Loading…</div>}>
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/login" element={<AdminPage />} />
        </Routes>
      ) : (
        <WebsiteLayout />
      )}
      <ScrollToTop />
      <SiteMotion />
      </Suspense>
    </>
  );
}
