import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';

export default function NotFoundPage() {
  const { isRTL } = useLanguage();

  return (
    <div className="not-found-page-view">
      <div className="container not-found-content">
        <div className="not-found-badge">{I.bolt} 404</div>
        <h1 className="not-found-title">
          {isRTL ? 'عذراً! الصفحة التي تبحث عنها غير موجودة' : 'Oops! The Page You Are Looking For Does Not Exist'}
        </h1>
        <p className="not-found-desc">
          {isRTL
            ? 'ربما تم نقل الصفحة أو كتابة الرابط بشكل غير دقيق. يمكنك العودة للصفحة الرئيسية أو التواصل معنا لطلب فني صيانة.'
            : 'The page might have been moved or the URL mistyped. Return to our homepage or contact us to book a technician.'}
        </p>

        <div className="not-found-actions">
          <Link to="/" className="btn btn-gold">
            {isRTL ? 'العودة للصفحة الرئيسية' : 'Return to Homepage'}
          </Link>
          <Link to="/services" className="btn btn-navy">
            {isRTL ? 'تصفح خدماتنا' : 'Browse Services'}
          </Link>
          <a className="btn btn-wa" href={waLink()} target="_blank" rel="noopener">
            {I.whatsapp} {isRTL ? 'راسلنا واتساب' : 'WhatsApp Us'}
          </a>
        </div>
      </div>
    </div>
  );
}
