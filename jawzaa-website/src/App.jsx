import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import { Footer, FloatActions } from './components/Layout.jsx';

// Pages
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ServiceDetailPage from './pages/ServiceDetailPage.jsx';
import PortfolioPage from './pages/PortfolioPage.jsx';
import CaseStudyDetailPage from './pages/CaseStudyDetailPage.jsx';
import IndustriesPage from './pages/IndustriesPage.jsx';
import IndustryDetailPage from './pages/IndustryDetailPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import GalleryPage from './pages/GalleryPage.jsx';
import WorkDetailPage from './pages/WorkDetailPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import CareersPage from './pages/CareersPage.jsx';
import PrivacyPage from './pages/PrivacyPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

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
          <Route path="/industries" element={<IndustriesPage />} />
          <Route path="/industries/:industryId" element={<IndustryDetailPage />} />
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
      <ScrollToTop />
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/login" element={<AdminPage />} />
        </Routes>
      ) : (
        <WebsiteLayout />
      )}
    </>
  );
}
