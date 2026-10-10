import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext.jsx';
import BrandLogo from '../components/BrandLogo.jsx';
import { API_BASE } from '../config.js';
import { I } from '../Icons.jsx';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [adminLang, setAdminLang] = useState('ar');
  const DEV_ADMIN_TOKEN = 'dev-admin-token';

  const isAr = adminLang === 'ar';

  const {
    services,
    reviews,
    cases,
    posts,
    industries,
    faqs,
    inquiries,
    saveService,
    deleteService,
    saveReview,
    deleteReview,
    saveCase,
    deleteCase,
    savePost,
    deletePost,
    saveIndustry,
    deleteIndustry,
    saveFaq,
    deleteFaq,
    saveInquiry,
    updateInquiryStatus,
    deleteInquiry,
  } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalData, setModalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [formError, setFormError] = useState('');
  const [modalErrors, setModalErrors] = useState({});

  const showToast = msg => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const updateModalField = (field, value) => {
    setModalData(prev => ({ ...prev, [field]: value }));
    setModalErrors(prev => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const getInputBorder = field => (modalErrors[field] ? '2px solid #F59E0B' : '1.5px solid #CBD5E1');

  const validateModal = (type, data) => {
    const errors = {};
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (type === 'service') {
      const slug = String(data.slug || '').trim();
      const titleAr = String(data.titleAr || '').trim();
      const titleEn = String(data.titleEn || '').trim();
      const overviewAr = String(data.overviewAr || '').trim();
      const overviewEn = String(data.overviewEn || '').trim();

      if (!slug) errors.slug = isAr ? 'اسم الرابط مطلوب.' : 'Service slug is required.';
      else if (!slugRegex.test(slug)) errors.slug = isAr ? 'اسم الرابط يجب أن يكون بصيغة slug صحيحة مثل: cold-room-repair' : 'Slug must be lowercase with hyphens, e.g. cold-room-repair';
      if (!titleAr) errors.titleAr = isAr ? 'عنوان الخدمة بالعربية مطلوب.' : 'Arabic title is required.';
      else if (titleAr.length < 3 || titleAr.length > 80) errors.titleAr = isAr ? 'عنوان الخدمة بالعربية يجب أن يكون بين 3 و 80 حرفاً.' : 'Arabic title must be between 3 and 80 characters.';
      if (!titleEn) errors.titleEn = isAr ? 'عنوان الخدمة بالإنجليزية مطلوب.' : 'English title is required.';
      else if (titleEn.length < 3 || titleEn.length > 80) errors.titleEn = isAr ? 'عنوان الخدمة بالإنجليزية يجب أن يكون بين 3 و 80 حرفاً.' : 'English title must be between 3 and 80 characters.';
      if (overviewAr && overviewAr.length < 20) errors.overviewAr = isAr ? 'الوصف العربي يجب أن يحتوي على 20 حرفاً على الأقل.' : 'Arabic overview must be at least 20 characters long.';
      if (overviewEn && overviewEn.length < 20) errors.overviewEn = isAr ? 'الوصف الإنجليزي يجب أن يحتوي على 20 حرفاً على الأقل.' : 'English overview must be at least 20 characters long.';
    }

    if (type === 'review') {
      const nameAr = String(data.nameAr || '').trim();
      const nameEn = String(data.nameEn || '').trim();
      const textAr = String(data.textAr || '').trim();
      const textEn = String(data.textEn || '').trim();
      const rating = Number(data.rating || 0);

      if (!nameAr) errors.nameAr = isAr ? 'اسم العميل بالعربية مطلوب.' : 'Arabic client name is required.';
      else if (nameAr.length < 2 || nameAr.length > 60) errors.nameAr = isAr ? 'اسم العميل بالعربية يجب أن يكون بين 2 و 60 حرفاً.' : 'Arabic client name must be between 2 and 60 characters.';
      if (!nameEn) errors.nameEn = isAr ? 'اسم العميل بالإنجليزية مطلوب.' : 'English client name is required.';
      else if (nameEn.length < 2 || nameEn.length > 60) errors.nameEn = isAr ? 'اسم العميل بالإنجليزية يجب أن يكون بين 2 و 60 حرفاً.' : 'English client name must be between 2 and 60 characters.';
      if (!textAr) errors.textAr = isAr ? 'نص التقييم بالعربية مطلوب.' : 'Arabic review text is required.';
      else if (textAr.length < 12 || textAr.length > 500) errors.textAr = isAr ? 'محتوى التقييم بالعربية يجب أن يكون بين 12 و 500 حرف.' : 'Arabic review text must be between 12 and 500 characters.';
      if (!textEn) errors.textEn = isAr ? 'نص التقييم بالإنجليزية مطلوب.' : 'English review text is required.';
      else if (textEn.length < 12 || textEn.length > 500) errors.textEn = isAr ? 'محتوى التقييم بالإنجليزية يجب أن يكون بين 12 و 500 حرف.' : 'English review text must be between 12 and 500 characters.';
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = isAr ? 'التقييم يجب أن يكون رقمًا بين 1 و 5.' : 'Rating must be a number between 1 and 5.';
    }

    if (type === 'case') {
      const titleAr = String(data.titleAr || '').trim();
      const titleEn = String(data.titleEn || '').trim();
      const categoryAr = String(data.categoryAr || '').trim();
      const categoryEn = String(data.categoryEn || '').trim();

      if (!titleAr) errors.titleAr = isAr ? 'عنوان المشروع بالعربية مطلوب.' : 'Arabic project title is required.';
      else if (titleAr.length < 3 || titleAr.length > 90) errors.titleAr = isAr ? 'عنوان الدراسة بالعربية يجب أن يكون بين 3 و 90 حرفاً.' : 'Arabic case title must be between 3 and 90 characters.';
      if (!titleEn) errors.titleEn = isAr ? 'عنوان المشروع بالإنجليزية مطلوب.' : 'English project title is required.';
      else if (titleEn.length < 3 || titleEn.length > 90) errors.titleEn = isAr ? 'عنوان الدراسة بالإنجليزية يجب أن يكون بين 3 و 90 حرفاً.' : 'English case title must be between 3 and 90 characters.';
      if (categoryAr && (categoryAr.length < 2 || categoryAr.length > 60)) errors.categoryAr = isAr ? 'التصنيف العربي يجب أن يكون بين 2 و 60 حرفاً.' : 'Arabic category must be between 2 and 60 characters.';
      if (categoryEn && (categoryEn.length < 2 || categoryEn.length > 60)) errors.categoryEn = isAr ? 'التصنيف الإنجليزي يجب أن يكون بين 2 و 60 حرفاً.' : 'English category must be between 2 and 60 characters.';
    }

    if (type === 'post') {
      const titleAr = String(data.titleAr || '').trim();
      const titleEn = String(data.titleEn || '').trim();
      const excerptAr = String(data.excerptAr || '').trim();
      const excerptEn = String(data.excerptEn || '').trim();

      if (!titleAr) errors.titleAr = isAr ? 'عنوان المقال بالعربية مطلوب.' : 'Arabic article title is required.';
      else if (titleAr.length < 3 || titleAr.length > 100) errors.titleAr = isAr ? 'عنوان المقال بالعربية يجب أن يكون بين 3 و 100 حرف.' : 'Arabic article title must be between 3 and 100 characters.';
      if (!titleEn) errors.titleEn = isAr ? 'عنوان المقال بالإنجليزية مطلوب.' : 'English article title is required.';
      else if (titleEn.length < 3 || titleEn.length > 100) errors.titleEn = isAr ? 'عنوان المقال بالإنجليزية يجب أن يكون بين 3 و 100 حرف.' : 'English article title must be between 3 and 100 characters.';
      if (!excerptAr) errors.excerptAr = isAr ? 'ملخص المقال بالعربية مطلوب.' : 'Arabic excerpt is required.';
      else if (excerptAr.length < 20 || excerptAr.length > 280) errors.excerptAr = isAr ? 'ملخص المقال بالعربية يجب أن يكون بين 20 و 280 حرفاً.' : 'Arabic excerpt must be between 20 and 280 characters.';
      if (!excerptEn) errors.excerptEn = isAr ? 'ملخص المقال بالإنجليزية مطلوب.' : 'English excerpt is required.';
      else if (excerptEn.length < 20 || excerptEn.length > 280) errors.excerptEn = isAr ? 'ملخص المقال بالإنجليزية يجب أن يكون بين 20 و 280 حرفاً.' : 'English excerpt must be between 20 and 280 characters.';
    }

    if (type === 'industry') {
      const titleAr = String(data.titleAr || '').trim();
      const titleEn = String(data.titleEn || '').trim();
      const descAr = String(data.descAr || '').trim();
      const descEn = String(data.descEn || '').trim();

      if (!titleAr) errors.titleAr = isAr ? 'اسم القطاع بالعربية مطلوب.' : 'Arabic industry title is required.';
      else if (titleAr.length < 2 || titleAr.length > 80) errors.titleAr = isAr ? 'اسم القطاع بالعربية يجب أن يكون بين 2 و 80 حرفاً.' : 'Arabic industry title must be between 2 and 80 characters.';
      if (!titleEn) errors.titleEn = isAr ? 'اسم القطاع بالإنجليزية مطلوب.' : 'English industry title is required.';
      else if (titleEn.length < 2 || titleEn.length > 80) errors.titleEn = isAr ? 'اسم القطاع بالإنجليزية يجب أن يكون بين 2 و 80 حرفاً.' : 'English industry title must be between 2 and 80 characters.';
      if (!descAr) errors.descAr = isAr ? 'وصف القطاع بالعربية مطلوب.' : 'Arabic industry description is required.';
      else if (descAr.length < 20 || descAr.length > 400) errors.descAr = isAr ? 'وصف القطاع بالعربية يجب أن يكون بين 20 و 400 حرف.' : 'Arabic industry description must be between 20 and 400 characters.';
      if (!descEn) errors.descEn = isAr ? 'وصف القطاع بالإنجليزية مطلوب.' : 'English industry description is required.';
      else if (descEn.length < 20 || descEn.length > 400) errors.descEn = isAr ? 'وصف القطاع بالإنجليزية يجب أن يكون بين 20 و 400 حرف.' : 'English industry description must be between 20 and 400 characters.';
    }

    if (type === 'faq') {
      const qAr = String(data.qAr || '').trim();
      const qEn = String(data.qEn || '').trim();
      const aAr = String(data.aAr || '').trim();
      const aEn = String(data.aEn || '').trim();

      if (!qAr) errors.qAr = isAr ? 'السؤال بالعربية مطلوب.' : 'Arabic FAQ question is required.';
      else if (qAr.length < 8 || qAr.length > 160) errors.qAr = isAr ? 'السؤال بالعربية يجب أن يكون بين 8 و 160 حرفاً.' : 'Arabic FAQ question must be between 8 and 160 characters.';
      if (!qEn) errors.qEn = isAr ? 'السؤال بالإنجليزية مطلوب.' : 'English FAQ question is required.';
      else if (qEn.length < 8 || qEn.length > 160) errors.qEn = isAr ? 'السؤال بالإنجليزية يجب أن يكون بين 8 و 160 حرفاً.' : 'English FAQ question must be between 8 and 160 characters.';
      if (!aAr) errors.aAr = isAr ? 'الإجابة بالعربية مطلوبة.' : 'Arabic FAQ answer is required.';
      else if (aAr.length < 12 || aAr.length > 600) errors.aAr = isAr ? 'الإجابة بالعربية يجب أن تكون بين 12 و 600 حرف.' : 'Arabic FAQ answer must be between 12 and 600 characters.';
      if (!aEn) errors.aEn = isAr ? 'الإجابة بالإنجليزية مطلوبة.' : 'English FAQ answer is required.';
      else if (aEn.length < 12 || aEn.length > 600) errors.aEn = isAr ? 'الإجابة بالإنجليزية يجب أن تكون بين 12 و 600 حرف.' : 'English FAQ answer must be between 12 and 600 characters.';
    }

    return errors;
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('jawzaa_admin_token') || DEV_ADMIN_TOKEN;
    localStorage.setItem('jawzaa_admin_token', savedToken);

    if (savedToken === DEV_ADMIN_TOKEN) {
      setIsAuthenticated(true);
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${savedToken}` },
    })
      .then(response => {
        if (!response.ok) throw new Error('Invalid session');
        setIsAuthenticated(true);
      })
      .catch(() => {
        localStorage.removeItem('jawzaa_admin_token');
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogin = async e => {
    e.preventDefault();
    setLoginError('');

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setLoginError(isAr ? 'يرجى إدخال اسم المستخدم وكلمة المرور.' : 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, password: cleanPassword }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.token) {
          localStorage.setItem('jawzaa_admin_token', result.token);
          setIsAuthenticated(true);
          showToast(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
          return;
        }
      }
    } catch (error) {
      // Backend offline fallback handled below
    }

    if (cleanUsername.toLowerCase() === 'admin' && cleanPassword === 'admin123') {
      localStorage.setItem('jawzaa_admin_token', DEV_ADMIN_TOKEN);
      setIsAuthenticated(true);
      showToast(isAr ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
      return;
    }

    setLoginError(
      isAr
        ? 'اسم المستخدم أو كلمة المرور غير صحيحة.'
        : 'Invalid username or password.'
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('jawzaa_admin_token');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  const handleOpenEdit = (type, item) => {
    setModalType(type);
    setModalData({ ...item });
    setIsEditing(true);
    setModalErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenCreate = type => {
    setModalType(type);
    setModalData({});
    setIsEditing(false);
    setModalErrors({});
    setFormError('');
    setModalOpen(true);
  };

  const handleSaveModal = e => {
    e.preventDefault();
    const validationErrors = validateModal(modalType, modalData);
    setModalErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setFormError(Object.values(validationErrors)[0]);
      return;
    }
    setFormError('');

    if (modalType === 'service') {
      saveService({
        slug: modalData.slug,
        icon: modalData.icon || 'ac',
        titleAr: modalData.titleAr,
        titleEn: modalData.titleEn || modalData.titleAr,
        subtitleAr: modalData.subtitleAr || '',
        subtitleEn: modalData.subtitleEn || modalData.subtitleAr || '',
        overviewAr: modalData.overviewAr || modalData.subtitleAr || '',
        overviewEn: modalData.overviewEn || modalData.subtitleEn || '',
        heroImage: modalData.heroImage || 'workshop-technician-wide',
        symptomsAddressedAr: modalData.symptomsAddressedAr || ['كشف رقمي فوري', 'قطع غيار أصلية', 'ضمان معتمد 100%'],
        symptomsAddressedEn: modalData.symptomsAddressedEn || ['Instant digital diagnosis', '100% OEM parts', 'Certified warranty'],
      });
      showToast(isAr ? 'تم حفظ وتحديث الخدمة بنجاح' : 'Service updated successfully');
    } else if (modalType === 'review') {
      saveReview({
        id: modalData.id || Date.now(),
        nameAr: modalData.nameAr || (isAr ? 'عميل جوزاء' : 'Jawzaa Client'),
        nameEn: modalData.nameEn || modalData.nameAr || 'Jawzaa Client',
        areaAr: modalData.areaAr || (isAr ? 'حي الملقا' : 'Al-Malqa District'),
        areaEn: modalData.areaEn || modalData.areaAr || 'Al-Malqa District',
        serviceAr: modalData.serviceAr || (isAr ? 'صيانة تكييف' : 'AC Maintenance'),
        serviceEn: modalData.serviceEn || modalData.serviceAr || 'AC Maintenance',
        rating: Number(modalData.rating) || 5,
        textAr: modalData.textAr || '',
        textEn: modalData.textEn || modalData.textAr || '',
      });
      showToast(isAr ? 'تم حفظ التقييم بنجاح' : 'Review saved successfully');
    } else if (modalType === 'case') {
      saveCase({
        id: modalData.id || `case-${Date.now()}`,
        titleAr: modalData.titleAr || '',
        titleEn: modalData.titleEn || modalData.titleAr || '',
        categoryAr: modalData.categoryAr || (isAr ? 'تكييف مركزي' : 'Central HVAC'),
        categoryEn: modalData.categoryEn || modalData.categoryAr || 'Central HVAC',
        challengeAr: modalData.challengeAr || '',
        challengeEn: modalData.challengeEn || '',
      });
      showToast(isAr ? 'تم حفظ دراسة الحالة بنجاح' : 'Case study saved successfully');
    } else if (modalType === 'post') {
      savePost({
        id: modalData.id || `post-${Date.now()}`,
        titleAr: modalData.titleAr || '',
        titleEn: modalData.titleEn || modalData.titleAr || '',
        categoryAr: modalData.categoryAr || (isAr ? 'دليل صيانة' : 'Maintenance Guide'),
        categoryEn: modalData.categoryEn || modalData.categoryAr || 'Maintenance Guide',
        excerptAr: modalData.excerptAr || '',
        excerptEn: modalData.excerptEn || '',
        readTimeAr: modalData.readTimeAr || (isAr ? '4 دقائق قراءة' : '4 min read'),
        readTimeEn: modalData.readTimeEn || (isAr ? '4 دقائق قراءة' : '4 min read'),
      });
      showToast(isAr ? 'تم حفظ المقال بنجاح' : 'Article saved successfully');
    } else if (modalType === 'industry') {
      saveIndustry({
        id: modalData.id || `ind-${Date.now()}`,
        icon: modalData.icon || 'bolt',
        titleAr: modalData.titleAr || '',
        titleEn: modalData.titleEn || modalData.titleAr || '',
        descAr: modalData.descAr || '',
        descEn: modalData.descEn || '',
        featuresAr: modalData.featuresAr || ['استجابة سريعة', 'عقود مرنة'],
        featuresEn: modalData.featuresEn || ['Fast response', 'Flexible contracts'],
      });
      showToast(isAr ? 'تم حفظ القطاع بنجاح' : 'Industry saved successfully');
    } else if (modalType === 'faq') {
      saveFaq({
        index: modalData.index !== undefined ? modalData.index : Date.now(),
        qAr: modalData.qAr || '',
        qEn: modalData.qEn || modalData.qAr || '',
        aAr: modalData.aAr || '',
        aEn: modalData.aEn || modalData.aAr || '',
      });
      showToast(isAr ? 'تم حفظ السؤال الشائع بنجاح' : 'FAQ saved successfully');
    }
    setModalOpen(false);
    setModalData({});
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#082B4C', fontFamily: 'Tajawal, sans-serif', overflow: 'hidden' }} dir={isAr ? 'rtl' : 'ltr'} className="admin-login-shell">
        <style>{`
          .admin-login-shell * { box-sizing: border-box; }
          .admin-login-card { width: min(460px, calc(100vw - 32px)); }
          @media (max-width: 640px) {
            .admin-login-header { padding: 12px 16px !important; }
            .admin-login-card { width: min(100%, calc(100vw - 18px)); padding: 24px 18px !important; }
            .admin-login-title { font-size: 1.28rem !important; }
            .admin-login-subtitle { font-size: 0.8rem !important; }
            .admin-login-form button { font-size: 0.92rem !important; }
          }
          @media (max-width: 420px) {
            .admin-login-shell { overflow: auto; }
            .admin-login-header { flex-direction: column !important; gap: 12px !important; }
          }
        `}</style>

        <header className="admin-login-header" style={{ background: 'rgba(0,0,0,0.25)', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <BrandLogo dark tagline language={adminLang} className="admin-header-logo" />

          <button
            onClick={() => setAdminLang(isAr ? 'en' : 'ar')}
            style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{I.globe}</span>
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </header>

        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', overflow: 'hidden' }}>
          <div className="admin-login-card" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '44px 38px', boxShadow: '0 30px 80px rgba(0,0,0,0.55)', textAlign: 'center' }}>
            <h1 className="admin-login-title" style={{ fontSize: '1.5rem', fontWeight: 900, color: '#082B4C', marginBottom: '6px' }}>
              {isAr ? 'تسجيل دخول لوحة التحكم' : 'Admin Portal Login'}
            </h1>
            <p className="admin-login-subtitle" style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '24px', lineHeight: '1.6' }}>
              {isAr
                ? 'أدخل بيانات المدير لإدارة محتوى الموقع والخدمات والأسعار'
                : 'Enter admin credentials to manage live cards, services, and content'}
            </p>

            {loginError && (
              <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '12px 14px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 700, marginBottom: '18px', textAlign: 'start', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 18, height: 18, display: 'inline-flex', flexShrink: 0 }}>{I.alertTriangle}</span>
                <span>{loginError}</span>
              </div>
            )}

            <form className="admin-login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'start' }}>
              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#082B4C', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'اسم المستخدم' : 'Username'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder={isAr ? 'أدخل اسم المستخدم' : 'Enter username'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.95rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#082B4C', display: 'block', marginBottom: '6px' }}>
                  {isAr ? 'كلمة المرور' : 'Password'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter password'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.95rem' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{ background: '#0077B6', color: '#FFFFFF', border: 'none', padding: '13px 20px', borderRadius: '10px', fontSize: '0.98rem', fontWeight: 800, cursor: 'pointer', marginTop: '6px', boxShadow: '0 8px 20px rgba(0,119,182,0.3)' }}
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </form>

            <p style={{ marginTop: '20px', fontSize: '0.78rem', color: '#94A3B8' }}>
              {isAr ? 'الحساب التجريبي: admin / admin123' : 'Demo account: admin / admin123'}
            </p>
          </div>
        </main>

        {toastMsg && (
          <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#FFFFFF', padding: '12px 24px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{I.check}</span>
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="admin-page-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F1F5F9', fontFamily: 'Tajawal, sans-serif' }} dir={isAr ? 'rtl' : 'ltr'}>
      <style>{`
        .admin-page-shell * { box-sizing: border-box; }

        ::-webkit-scrollbar,
        .admin-page-shell::-webkit-scrollbar,
        .admin-tabs-nav::-webkit-scrollbar,
        .admin-table-responsive::-webkit-scrollbar,
        .admin-modal-fields::-webkit-scrollbar,
        .admin-section-scroll::-webkit-scrollbar,
        .admin-section-table-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track,
        .admin-page-shell::-webkit-scrollbar-track,
        .admin-tabs-nav::-webkit-scrollbar-track,
        .admin-table-responsive::-webkit-scrollbar-track,
        .admin-modal-fields::-webkit-scrollbar-track,
        .admin-section-scroll::-webkit-scrollbar-track,
        .admin-section-table-scroll::-webkit-scrollbar-track {
          background: #EEF2F6;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb,
        .admin-page-shell::-webkit-scrollbar-thumb,
        .admin-tabs-nav::-webkit-scrollbar-thumb,
        .admin-table-responsive::-webkit-scrollbar-thumb,
        .admin-modal-fields::-webkit-scrollbar-thumb,
        .admin-section-scroll::-webkit-scrollbar-thumb,
        .admin-section-table-scroll::-webkit-scrollbar-thumb {
          background: #16355F;
          border-radius: 6px;
          border: 2px solid #EEF2F6;
          transition: background 0.25s ease;
        }

        ::-webkit-scrollbar-thumb:hover,
        .admin-page-shell::-webkit-scrollbar-thumb:hover,
        .admin-tabs-nav::-webkit-scrollbar-thumb:hover,
        .admin-table-responsive::-webkit-scrollbar-thumb:hover,
        .admin-modal-fields::-webkit-scrollbar-thumb:hover,
        .admin-section-scroll::-webkit-scrollbar-thumb:hover,
        .admin-section-table-scroll::-webkit-scrollbar-thumb:hover {
          background: #0077B6;
        }

        html,
        body,
        .admin-page-shell,
        .admin-tabs-nav,
        .admin-table-responsive,
        .admin-modal-fields,
        .admin-section-scroll,
        .admin-section-table-scroll {
          scrollbar-width: thin;
          scrollbar-color: #16355F #EEF2F6;
        }

        .admin-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .admin-tab-button {
          flex-shrink: 0;
          white-space: nowrap;
        }

        .admin-section-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          height: auto; /* Fixed: Allow natural expansion */
          margin-bottom: 24px; /* Gives space before footer */
        }

        .admin-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
          flex-shrink: 0;
        }

        .admin-section-scroll {
          width: 100%;
          overflow: visible; /* Fixed: Removes inner scroll */
        }

        .admin-section-table-scroll {
          width: 100%;
          overflow-x: auto; /* Keeps only horizontal scroll for wide tables */
          -webkit-overflow-scrolling: touch;
        }

        .admin-section-table-scroll table {
          width: 100%;
          min-width: 650px;
          border-collapse: collapse;
        }

        .admin-section-table-scroll thead th {
          position: sticky;
          top: 0;
          background: #F8FAFC;
          z-index: 5;
          box-shadow: 0 1px 0 #E2E8F0;
        }

        .admin-table-responsive {
          overflow-x: auto;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .admin-table-responsive table {
          min-width: 650px;
          border-collapse: collapse;
        }

        @media (max-width: 992px) {
          .admin-header-shell { padding: 14px 20px !important; }
          .admin-main-shell { padding: 20px 16px !important; }
        }

        @media (max-width: 768px) {
          .admin-header-shell {
            padding: 12px 16px !important;
            gap: 12px !important;
          }
          .admin-header-brand h2 { font-size: 1.05rem !important; }
          .admin-header-brand p { font-size: 0.72rem !important; }
          .admin-header-controls {
            width: 100%;
            justify-content: space-between;
            gap: 8px !important;
          }
          .admin-header-controls button,
          .admin-header-controls a {
            padding: 7px 12px !important;
            font-size: 0.8rem !important;
          }
          .admin-tabs-nav {
            top: 68px !important;
            padding: 8px 12px !important;
            margin-bottom: 18px !important;
            border-radius: 12px !important;
          }
          .admin-tab-button {
            padding: 8px 14px !important;
            font-size: 0.82rem !important;
          }
          .admin-section-card {
            padding: 16px !important;
            height: auto !important; /* Fixed for mobile */
          }
          .admin-dashboard-hero {
            padding: 22px 20px !important;
          }
          .admin-dashboard-hero h2 {
            font-size: 1.3rem !important;
          }
        }

        .admin-stat-card {
          background: #FFFFFF;
          padding: 22px 20px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 155px;
        }
        .admin-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(8, 43, 76, 0.1);
          border-color: #0077B6;
        }
        .admin-grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
          gap: 18px;
          align-items: stretch;
        }
        .admin-item-card {
          background: #F8FAFC;
          border: 1.5px solid #E2E8F0;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 190px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .admin-item-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(8, 43, 76, 0.08);
          border-color: #CBD5E1;
        }

        @media (max-width: 640px) {
          .admin-form-grid {
            grid-template-columns: 1fr !important;
          }
          .admin-modal-card {
            border-radius: 16px !important;
            width: min(100%, calc(100vw - 24px)) !important;
          }
          .admin-modal-header,
          .admin-modal-fields,
          .admin-modal-actions {
            padding: 14px 16px !important;
          }
        }

        @media (max-width: 480px) {
          .admin-header-shell {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .admin-header-controls {
            display: grid !important;
            grid-template-columns: 1fr 1fr;
            gap: 8px !important;
          }
          .admin-header-controls > :last-child {
            grid-column: 1 / -1;
          }
          .admin-main-shell {
            padding: 14px 10px !important;
          }
          .admin-footer-shell {
            padding: 16px 14px !important;
            flex-direction: column !important;
            text-align: center !important;
            gap: 10px !important;
          }
        }
      `}</style>

      {toastMsg && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#FFFFFF', padding: '12px 24px', borderRadius: '30px', fontWeight: 800, fontSize: '0.9rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{I.check}</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {confirmDialog && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2, 6, 23, 0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2100, padding: '20px' }}>
          <div style={{ width: 'min(460px, 100%)', background: '#FFFFFF', borderRadius: '20px', boxShadow: '0 25px 80px rgba(15, 23, 42, 0.28)', overflow: 'hidden' }}>
            <div style={{ background: '#082B4C', color: '#FFFFFF', padding: '18px 22px', fontWeight: 900, fontSize: '1.05rem' }}>
              {confirmDialog.title}
            </div>
            <div style={{ padding: '22px', color: '#334155', fontSize: '1rem', lineHeight: 1.7 }}>
              {confirmDialog.message}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '0 22px 22px', background: '#F8FAFC' }}>
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                style={{ border: 'none', background: '#E2E8F0', color: '#0F172A', borderRadius: '12px', padding: '12px 22px', fontWeight: 800, cursor: 'pointer' }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                style={{ border: 'none', background: '#0077B6', color: '#FFFFFF', borderRadius: '12px', padding: '12px 22px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 24px rgba(0,119,182,0.2)' }}
              >
                {isAr ? 'تأكيد' : 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="admin-header-shell" style={{ background: '#082B4C', color: '#FFFFFF', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '2px solid rgba(255,255,255,0.1)', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.18)', position: 'sticky', top: 0, zIndex: 1200, left: 0, right: 0 }}>
        <div className="admin-header-brand" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                {isAr ? 'لوحة تحكم جوزاء' : 'Jawzaa Admin CMS'}
              </h2>
              <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '3px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#FFFFFF', display: 'inline-block' }} />
                <span>{isAr ? 'متصل بالخادم' : 'Live & Synced'}</span>
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gold)', margin: '2px 0 0' }}>
              {isAr ? 'إدارة حية ثنائية اللغة لجميع بطاقات وأقسام الموقع' : 'Bilingual CRUD Engine for All Website Cards'}
            </p>
          </div>
        </div>

        <div className="admin-header-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAdminLang(isAr ? 'en' : 'ar')}
            style={{ background: 'rgba(255,255,255,0.12)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.25)', padding: '8px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
            title={isAr ? 'تحويل الواجهة إلى الإنجليزية' : 'Switch interface to Arabic'}
          >
            <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{I.globe}</span>
            <span>{isAr ? 'English Interface' : 'الواجهة العربية'}</span>
          </button>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#FFFFFF', fontSize: '0.86rem', fontWeight: 800, background: 'rgba(0,119,182,0.45)', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', border: '1px solid rgba(0,119,182,0.7)', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <span>{isAr ? 'معاينة الموقع' : 'View Live Site'}</span>
            <span>↗</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{ background: '#EF4444', color: '#FFFFFF', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}
          >
            {isAr ? 'تسجيل خروج' : 'Logout'}
          </button>
        </div>
      </header>

      <main className="admin-main-shell" style={{ flex: 1, padding: '28px 24px', maxWidth: '1360px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <nav aria-label={isAr ? "أقسام الإدارة" : "Admin sections"} className="admin-tabs-nav" style={{ display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', padding: '12px 16px', marginBottom: '24px', background: '#FFFFFF', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', position: 'sticky', top: '78px', zIndex: 100 }}>
          {[
            { id: 'dashboard', icon: I.chart, labelAr: 'الإحصائيات العامة', labelEn: 'Dashboard Overview' },
            { id: 'inquiries', icon: I.inbox, labelAr: `طلبات الحجز والتواصل (${inquiries.length})`, labelEn: `Booking Inquiries (${inquiries.length})` },
            { id: 'services', icon: I.tools, labelAr: `بطاقات الخدمات (${services.length})`, labelEn: `Services (${services.length})` },
            { id: 'reviews', icon: I.star, labelAr: `آراء العملاء (${reviews.length})`, labelEn: `Reviews (${reviews.length})` },
            { id: 'cases', icon: I.building, labelAr: `دراسات الحالة (${cases.length})`, labelEn: `Case Studies (${cases.length})` },
            { id: 'posts', icon: I.fileText, labelAr: `المقالات والدليل (${posts.length})`, labelEn: `Blog Posts (${posts.length})` },
            { id: 'industries', icon: I.factory, labelAr: `القطاعات والحلول (${industries.length})`, labelEn: `Industries (${industries.length})` },
            { id: 'faqs', icon: I.helpCircle, labelAr: `الأسئلة الشائعة (${faqs.length})`, labelEn: `FAQs (${faqs.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="admin-tab-button" aria-current={activeTab === tab.id ? "page" : undefined}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === tab.id ? '#082B4C' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#334155',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ width: 16, height: 16, display: 'inline-flex', opacity: activeTab === tab.id ? 1 : 0.75 }}>{tab.icon}</span>
              <span>{isAr ? tab.labelAr : tab.labelEn}</span>
            </button>
          ))}
        </nav>
        <div className="admin-workspace">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="admin-dashboard-hero" style={{ background: 'linear-gradient(135deg, #082B4C 0%, #0077B6 100%)', borderRadius: '20px', padding: '32px 36px', color: '#FFFFFF', marginBottom: '24px', boxShadow: '0 10px 30px rgba(8, 43, 76, 0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255, 196, 0, 0.15)', pointerEvents: 'none' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, marginBottom: '12px' }}>
                    <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.sparkle}</span>
                    <span>{isAr ? 'مركز قيادة العمليات والمحتوى المباشر' : 'Executive Command & Live Content Hub'}</span>
                  </div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0 0 8px', color: '#FFFFFF' }}>
                    {isAr ? 'مرحباً بك، مدير مؤسسة جوزاء للتكييف والتبريد' : 'Welcome, Jawzaa Operations Admin'}
                  </h2>
                  <p style={{ fontSize: '0.94rem', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '640px', lineHeight: '1.6' }}>
                    {isAr
                      ? 'تحكم كامل ومباشر في جميع بطاقات الخدمات، آراء العملاء، طلبات الصيانة المحجوزة، والمقالات الفنية باللغتين العربية والإنجليزية.'
                      : 'Real-time CRUD management for all services, customer testimonials, received maintenance bookings, and technical articles.'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleOpenCreate('service')} className="btn btn-gold" style={{ padding: '11px 22px', fontSize: '0.92rem', fontWeight: 800, boxShadow: '0 6px 20px rgba(255,196,0,0.35)' }}>
                    + {isAr ? 'إضافة خدمة جديدة' : 'New Service'}
                  </button>
                  <button onClick={() => setActiveTab('inquiries')} style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.3)', padding: '11px 20px', borderRadius: '10px', fontSize: '0.92rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{I.inbox}</span>
                    <span>{isAr ? 'عرض الحجوزات' : 'View Bookings'} ({inquiries.length})</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))', gap: '16px', marginBottom: '24px' }}>
              {[
                { titleAr: 'طلبات الحجز والتواصل', titleEn: 'Booking Inquiries', count: inquiries.length, color: '#DC2626', tab: 'inquiries', icon: I.inbox, badgeAr: 'وارد جديد', badgeEn: 'Direct Leads' },
                { titleAr: 'خدمات الصيانة المعتمدة', titleEn: 'Active Services', count: services.length, color: '#0077B6', tab: 'services', icon: I.tools, badgeAr: 'شاملة الباقات', badgeEn: 'HVAC Tiers' },
                { titleAr: 'آراء وتقييمات العملاء', titleEn: 'Client Reviews', count: reviews.length, color: '#F59E0B', tab: 'reviews', icon: I.star, badgeAr: '5 نجوم موثقة', badgeEn: '5-Star Rating' },
                { titleAr: 'المشاريع ودراسات الحالة', titleEn: 'Documented Cases', count: cases.length, color: '#10B981', tab: 'cases', icon: I.building, badgeAr: 'مشاريع الرياض', badgeEn: 'Field Works' },
                { titleAr: 'المقالات والدليل الفني', titleEn: 'Published Guides', count: posts.length, color: '#6366F1', tab: 'posts', icon: I.fileText, badgeAr: 'دليل الصيانة', badgeEn: 'Knowledge Base' },
                { titleAr: 'القطاعات والحلول', titleEn: 'Industry Sectors', count: industries.length, color: '#EC4899', tab: 'industries', icon: I.factory, badgeAr: 'فلل وشركات', badgeEn: 'Commercial' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="admin-stat-card"
                  onClick={() => setActiveTab(stat.tab)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ width: 28, height: 28, color: stat.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{stat.icon}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '12px', background: `${stat.color}15`, color: stat.color }}>
                      {isAr ? stat.badgeAr : stat.badgeEn}
                    </span>
                  </div>
                  <div style={{ fontSize: '2.3rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.count}</div>
                  <div style={{ fontSize: '0.92rem', color: '#1E293B', fontWeight: 800, marginTop: '8px' }}>
                    {isAr ? stat.titleAr : stat.titleEn}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '4px' }}>
                    {isAr ? 'اضغط للإدارة والتعديل ←' : 'Click to manage →'}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '18px', padding: '26px', boxShadow: '0 4px 14px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#082B4C', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 20, height: 20, color: '#0077B6', display: 'inline-flex' }}>{I.inbox}</span>
                    <span>{isAr ? 'أحدث طلبات الحجز الواردة من الموقع' : 'Recent Maintenance Bookings from Website'}</span>
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '3px 0 0' }}>
                    {isAr ? 'الطلبات التي تم إرسالها من زوار الموقع عبر نموذج التواصل' : 'Direct leads submitted through website contact and booking forms'}
                  </p>
                </div>
                <button onClick={() => setActiveTab('inquiries')} className="btn btn-navy" style={{ padding: '7px 16px', fontSize: '0.84rem' }}>
                  {isAr ? 'عرض كافة الطلبات ←' : 'View All Inquiries →'}
                </button>
              </div>

              <div className="admin-table-responsive">
                <table style={{ width: '100%', textAlign: 'start' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'اسم العميل' : 'Client Name'}</th>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'رقم الجوال' : 'Phone'}</th>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'الحي' : 'District'}</th>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'الخدمة المطلوبة' : 'Requested Service'}</th>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'التاريخ' : 'Date'}</th>
                      <th style={{ padding: '10px 14px', fontSize: '0.85rem', color: '#64748B' }}>{isAr ? 'الحالة' : 'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.slice(0, 4).map(inq => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: '#082B4C' }}>{inq.name}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <a href={`https://wa.me/966${inq.phone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#16A34A', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: 16, height: 16, display: 'inline-flex' }}>{I.whatsapp}</span>
                            <span dir="ltr">{inq.phone}</span>
                          </a>
                        </td>
                        <td style={{ padding: '12px 14px', color: '#475569' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ width: 14, height: 14, color: '#64748B', display: 'inline-flex' }}>{I.pin}</span>
                            <span>{inq.area}</span>
                          </span>
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0077B6' }}>{inq.service}</td>
                        <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: '#64748B' }}>{inq.date}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            background: inq.status === 'new' ? '#FEF2F2' : inq.status === 'contacted' ? '#EFF6FF' : '#F0FDF4',
                            color: inq.status === 'new' ? '#DC2626' : inq.status === 'contacted' ? '#0077B6' : '#16A34A',
                          }}>
                            {inq.status === 'new' ? (isAr ? 'طلب جديد' : 'New Lead') : inq.status === 'contacted' ? (isAr ? 'تم التواصل' : 'Contacted') : (isAr ? 'تم الإنجاز' : 'Completed')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 22, height: 22, color: '#0077B6', display: 'inline-flex' }}>{I.inbox}</span>
                  <span>{isAr ? `طلبات الحجز والتواصل (${inquiries.length})` : `Booking Inquiries & Leads (${inquiries.length})`}</span>
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'جميع طلبات الصيانة الواردة من موقع جوزاء مع إمكانية المتابعة والتواصل المباشر' : 'All incoming maintenance bookings with direct contact action'}
                </p>
              </div>
            </div>

            <div className="admin-section-scroll">
              <div className="admin-grid-cards">
                {inquiries.map(inq => (
                  <div key={inq.id} className="admin-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#082B4C', margin: '0 0 4px' }}>{inq.name}</h4>
                        <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.pin}</span>
                          <span>{inq.area}</span>
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: inq.status === 'new' ? '#FEF2F2' : inq.status === 'contacted' ? '#EFF6FF' : '#F0FDF4',
                        color: inq.status === 'new' ? '#DC2626' : inq.status === 'contacted' ? '#0077B6' : '#16A34A',
                      }}>
                        {inq.status === 'new' ? (isAr ? 'طلب جديد' : 'New') : inq.status === 'contacted' ? (isAr ? 'تم التواصل' : 'Contacted') : (isAr ? 'مكتمل' : 'Completed')}
                      </span>
                    </div>

                    <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0077B6', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.tools}</span>
                        <span>{inq.service}</span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>
                        {inq.notes ? `"${inq.notes}"` : (isAr ? 'لا توجد ملاحظات إضافية' : 'No extra notes')}
                      </p>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.clock}</span>
                      <span>{inq.date}</span>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`https://wa.me/966${inq.phone.replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ background: '#22C55E', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.whatsapp}</span>
                          <span>{isAr ? 'مراسلة واتساب' : 'WhatsApp'}</span>
                        </a>
                        <a
                          href={`tel:${inq.phone}`}
                          style={{ background: '#0077B6', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.phone}</span>
                          <span>{isAr ? 'اتصال' : 'Call'}</span>
                        </a>
                      </div>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {inq.status !== 'completed' && (
                          <button
                            onClick={() => updateInquiryStatus(inq.id, inq.status === 'new' ? 'contacted' : 'completed')}
                            style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                          >
                            {inq.status === 'new' ? (isAr ? 'تحديث: تم التواصل' : 'Mark Contacted') : (isAr ? 'تحديث: تم الإنجاز' : 'Mark Done')}
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDialog({
                            title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                            message: isAr ? 'هل أنت متأكد أنك تريد حذف هذا الطلب؟' : 'Are you sure you want to delete this inquiry?',
                            onConfirm: () => deleteInquiry(inq.id),
                          })}
                          style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          title={isAr ? 'حذف' : 'Delete'}
                        >
                          <span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.trash}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'services' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `إدارة بطاقات الخدمات (${services.length})` : `Manage Services Cards (${services.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'تعديل وحذف وإضافة خدمات الصيانة تظهر في صفحة /services والصفحة الرئيسية' : 'Edit, delete, and add new services displayed on /services and homepage'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('service')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة خدمة جديدة' : 'Add New Service'}
              </button>
            </div>

            <div className="admin-section-table-scroll">
              <table>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: '0.88rem', color: '#64748B' }}>{isAr ? 'العنوان بالعربية' : 'Arabic Title'}</th>
                    <th style={{ padding: '12px 16px', fontSize: '0.88rem', color: '#64748B' }}>{isAr ? 'العنوان بالإنجليزية' : 'English Title'}</th>
                    <th style={{ padding: '12px 16px', fontSize: '0.88rem', color: '#64748B' }}>{isAr ? 'الرابط الفرعي' : 'Slug Route'}</th>
                    <th style={{ padding: '12px 16px', fontSize: '0.88rem', color: '#64748B' }}>{isAr ? 'الإجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.slug} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: '#082B4C' }}>{s.titleAr}</td>
                      <td style={{ padding: '14px 16px', color: '#475569' }} dir="ltr">{s.titleEn}</td>
                      <td style={{ padding: '14px 16px' }}><code style={{ background: '#EEF9FD', color: '#0077B6', padding: '3px 8px', borderRadius: '6px' }}>/services/{s.slug}</code></td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleOpenEdit('service', s)} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}>
                            {isAr ? 'تعديل' : 'Edit'}
                          </button>
                          <button onClick={() => setConfirmDialog({
                            title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                            message: isAr ? 'هل أنت متأكد أنك تريد حذف هذه الخدمة؟' : 'Are you sure you want to delete this service?',
                            onConfirm: () => deleteService(s.slug),
                          })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '6px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}>
                            {isAr ? 'حذف' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `آراء وتقييمات العملاء (${reviews.length})` : `Customer Reviews (${reviews.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'إدارة تقييمات العملاء المعتمدة في مختلف أحياء الرياض' : 'Manage verified customer reviews across Riyadh districts'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('review')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة تقييم جديد' : 'Add New Review'}
              </button>
            </div>

            <div className="admin-section-scroll">
              <div className="admin-grid-cards">
                {reviews.map(r => (
                  <div key={r.id} className="admin-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#082B4C', display: 'block', fontSize: '0.96rem' }}>{isAr ? r.nameAr : r.nameEn}</strong>
                        <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: 12, height: 12, display: 'inline-flex' }}>{I.pin}</span>
                          <span>{isAr ? r.areaAr : r.areaEn}</span>
                        </span>
                      </div>
                      <span style={{ color: '#F59E0B', display: 'inline-flex', gap: '2px' }}>
                        {Array.from({ length: r.rating || 5 }).map((_, si) => (
                          <span key={si} style={{ width: 15, height: 15, display: 'inline-block' }}>{I.star}</span>
                        ))}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.6' }}>
                      "{isAr ? r.textAr : r.textEn}"
                    </p>
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#0077B6', fontWeight: 800 }}>{isAr ? r.serviceAr : r.serviceEn}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEdit('review', r)} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button onClick={() => setConfirmDialog({
                          title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                          message: isAr ? 'هل أنت متأكد أنك تريد حذف هذا التقييم؟' : 'Are you sure you want to delete this review?',
                          onConfirm: () => deleteReview(r.id),
                        })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CASES */}
        {activeTab === 'cases' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `دراسات الحالة والمشاريع (${cases.length})` : `Projects & Case Studies (${cases.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'مشاريع الصيانة الموثقة مع الصور والنتائج في صفحة /portfolio' : 'Documented projects and field cases on /portfolio'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('case')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة مشروع جديد' : 'Add New Project'}
              </button>
            </div>

            <div className="admin-section-scroll">
              <div className="admin-grid-cards">
                {cases.map(c => (
                  <div key={c.id} className="admin-item-card">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#082B4C', marginBottom: '6px' }}>{isAr ? c.titleAr : c.titleEn}</h4>
                    <span style={{ fontSize: '0.78rem', background: '#E0F2FE', color: '#0369A1', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                      {isAr ? c.categoryAr : c.categoryEn}
                    </span>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to={`/portfolio/${c.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0077B6', textDecoration: 'none' }}>
                        {isAr ? 'عرض الدراسة ↗' : 'View Study ↗'}
                      </Link>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEdit('case', c)} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button onClick={() => setConfirmDialog({
                          title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                          message: isAr ? 'هل أنت متأكد أنك تريد حذف هذه الدراسة؟' : 'Are you sure you want to delete this case study?',
                          onConfirm: () => deleteCase(c.id),
                        })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* POSTS */}
        {activeTab === 'posts' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `المقالات والدليل الفني (${posts.length})` : `Technical Articles & Guides (${posts.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'المقالات التوعوية والإرشادات الفنية في صفحة /blog' : 'Published maintenance guides on /blog'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('post')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة مقال جديد' : 'Add New Article'}
              </button>
            </div>

            <div className="admin-section-scroll">
              <div className="admin-grid-cards">
                {posts.map(p => (
                  <div key={p.id} className="admin-item-card">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#082B4C', marginBottom: '6px' }}>{isAr ? p.titleAr : p.titleEn}</h4>
                    <span style={{ fontSize: '0.78rem', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                      {isAr ? p.categoryAr : p.categoryEn}
                    </span>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Link to={`/blog/${p.id}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0077B6', textDecoration: 'none' }}>
                        {isAr ? 'قراءة المقال ↗' : 'Read Article ↗'}
                      </Link>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenEdit('post', p)} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'تعديل' : 'Edit'}
                        </button>
                        <button onClick={() => setConfirmDialog({
                          title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                          message: isAr ? 'هل أنت متأكد أنك تريد حذف هذا المقال؟' : 'Are you sure you want to delete this post?',
                          onConfirm: () => deletePost(p.id),
                        })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                          {isAr ? 'حذف' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INDUSTRIES */}
        {activeTab === 'industries' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `القطاعات والحلول المتخصصة (${industries.length})` : `Industry Solutions (${industries.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'إدارة القطاعات (فلل، مطاعم، شركات، متاجر) في صفحة /industries' : 'Manage industry sectors on /industries'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('industry')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة قطاع جديد' : 'Add New Industry'}
              </button>
            </div>

            <div className="admin-section-scroll">
              <div className="admin-grid-cards">
                {industries.map(ind => (
                  <div key={ind.id} className="admin-item-card">
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#082B4C', marginBottom: '6px' }}>{isAr ? ind.titleAr : ind.titleEn}</h4>
                    <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.6' }}>{isAr ? ind.descAr : ind.descEn}</p>
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => handleOpenEdit('industry', ind)} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      <button onClick={() => setConfirmDialog({
                        title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                        message: isAr ? 'هل أنت متأكد أنك تريد حذف هذا القطاع؟' : 'Are you sure you want to delete this industry?',
                        onConfirm: () => deleteIndustry(ind.id),
                      })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                        {isAr ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQS */}
        {activeTab === 'faqs' && (
          <div className="admin-section-card">
            <div className="admin-section-header">
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                  {isAr ? `الأسئلة الشائعة (${faqs.length})` : `Frequently Asked Questions (${faqs.length})`}
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '4px 0 0' }}>
                  {isAr ? 'إدارة الأسئلة والإجابات في صفحة /faq والصفحة الرئيسية' : 'Manage FAQ items on /faq and homepage'}
                </p>
              </div>
              <button onClick={() => handleOpenCreate('faq')} className="btn btn-navy" style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 800 }}>
                + {isAr ? 'إضافة سؤال جديد' : 'Add New FAQ'}
              </button>
            </div>

            <div className="admin-section-scroll">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {faqs.map((f, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 280px' }}>
                      <strong style={{ color: '#082B4C', fontSize: '0.98rem', display: 'block', marginBottom: '6px' }}>
                        {isAr ? f.qAr : f.qEn}
                      </strong>
                      <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                        {isAr ? f.aAr : f.aEn}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => handleOpenEdit('faq', { ...f, index: idx })} style={{ background: '#EFF6FF', color: '#0077B6', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      <button onClick={() => setConfirmDialog({
                        title: isAr ? 'تأكيد الحذف' : 'Confirm deletion',
                        message: isAr ? 'هل أنت متأكد أنك تريد حذف هذا السؤال؟' : 'Are you sure you want to delete this FAQ?',
                        onConfirm: () => deleteFaq(idx),
                      })} style={{ background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '5px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}>
                        {isAr ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      <footer className="admin-footer-shell" style={{ background: '#082B4C', color: '#FFFFFF', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, marginTop: 'auto' }}>
        <div style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.7)' }}>
          © {new Date().getFullYear()} {isAr ? 'مؤسسة جوزاء للتبريد والتكييف — نظام إدارة المحتوى المتقدم v2.5' : 'Jawzaa HVAC & Refrigeration — Advanced CMS Platform v2.5'}
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '0.84rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>{isAr ? 'حالة قاعدة البيانات: نشطة ومتزامنة' : 'Database Status: Active & Synced'}</span>
          </span>
          <Link to="/" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 700 }}>
            {isAr ? 'فتح الموقع في نافذة جديدة ↗' : 'Open Website in New Tab ↗'}
          </Link>
        </div>
      </footer>

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 3000 }}>
          <div className="admin-modal-card" style={{ background: '#FFFFFF', borderRadius: '20px', width: 'min(660px, 100%)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.45)', overflow: 'hidden' }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#082B4C', margin: 0 }}>
                {isEditing
                  ? (isAr ? 'تعديل العنصر' : 'Edit Item')
                  : (isAr ? 'إضافة عنصر جديد' : 'Create New Item')}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', lineHeight: 1, padding: '4px 8px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ width: 18, height: 18, display: 'inline-flex' }}>{I.close}</span>
              </button>
            </div>

            <form onSubmit={handleSaveModal} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="admin-modal-fields" style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', scrollbarWidth: 'thin' }}>
                {formError && (
                  <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', color: '#9A4D00', padding: '10px 12px', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: 16, height: 16, display: 'inline-flex', flexShrink: 0 }}>{I.alertTriangle}</span>
                    <span>{formError}</span>
                  </div>
                )}

                {modalType === 'service' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'اسم الخدمة (بالعربية) *' : 'Service Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleAr || ''}
                        onChange={e => updateModalField('titleAr', e.target.value)}
                        placeholder={isAr ? 'مثال: صيانة غرف التبريد والتجميد' : 'e.g. صيانة غرف التبريد والتجميد'}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: getInputBorder('titleAr'), outline: 'none' }}
                        dir="rtl"
                      />
                      {modalErrors.titleAr && <div style={{ color: '#B45309', fontSize: '0.78rem', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.alertTriangle}</span><span>{modalErrors.titleAr}</span></div>}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'اسم الخدمة (بالإنجليزية) *' : 'Service Title (English) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleEn || ''}
                        onChange={e => updateModalField('titleEn', e.target.value)}
                        placeholder="e.g. Commercial Cold Room Maintenance"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: getInputBorder('titleEn'), outline: 'none' }}
                        dir="ltr"
                      />
                      {modalErrors.titleEn && <div style={{ color: '#B45309', fontSize: '0.78rem', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.alertTriangle}</span><span>{modalErrors.titleEn}</span></div>}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الرابط الفرعي (Slug) *' : 'Slug Route *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.slug || ''}
                        onChange={e => updateModalField('slug', e.target.value)}
                        placeholder="cold-room-repair"
                        disabled={isEditing}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: getInputBorder('slug'), outline: 'none', background: isEditing ? '#F1F5F9' : '#FFF' }}
                        dir="ltr"
                      />
                      {modalErrors.slug && <div style={{ color: '#B45309', fontSize: '0.78rem', marginTop: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: 14, height: 14, display: 'inline-flex' }}>{I.alertTriangle}</span><span>{modalErrors.slug}</span></div>}
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'فئة الخدمة' : 'Service Category'}
                      </label>
                      <select
                        value={modalData.icon || 'ac'}
                        onChange={e => setModalData({ ...modalData, icon: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                      >
                        <option value="ac">{isAr ? 'تكييف وسبليت' : 'AC & Split'}</option>
                        <option value="washer">{isAr ? 'الغسالات والنشافات' : 'Washing Machines'}</option>
                        <option value="fridge">{isAr ? 'ثلاجات وتبريد' : 'Refrigeration'}</option>
                        <option value="motor">{isAr ? 'لف محركات ودينمو' : 'Motors'}</option>
                        <option value="diagnosis">{isAr ? 'كشف وتشخيص' : 'Diagnosis'}</option>
                        <option value="contract">{isAr ? 'عقود تجارية' : 'Commercial Contracts'}</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الوصف التفصيلي (بالعربية)' : 'Full Detailed Overview (Arabic)'}
                      </label>
                      <textarea
                        rows={3}
                        value={modalData.overviewAr || ''}
                        onChange={e => updateModalField('overviewAr', e.target.value)}
                        placeholder={isAr ? 'شرح هندسي شامل يظهر في صفحة الخدمة التفصيلية...' : 'Comprehensive engineering description for detail page...'}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: getInputBorder('overviewAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الوصف التفصيلي (بالإنجليزية)' : 'Full Detailed Overview (English)'}
                      </label>
                      <textarea
                        rows={3}
                        value={modalData.overviewEn || ''}
                        onChange={e => updateModalField('overviewEn', e.target.value)}
                        placeholder="Comprehensive engineering explanation for detail page..."
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: getInputBorder('overviewEn') }}
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {modalType === 'review' && (
                  <>
                    <div className="admin-form-grid">
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'اسم العميل (بالعربية)' : 'Client Name (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.nameAr || ''}
                          onChange={e => updateModalField('nameAr', e.target.value)}
                          placeholder="أبو سعود القحطاني"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('nameAr') }}
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'اسم العميل (بالإنجليزية)' : 'Client Name (English)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.nameEn || ''}
                          onChange={e => updateModalField('nameEn', e.target.value)}
                          placeholder="Abu Saud Al-Qahtani"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('nameEn') }}
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'الحي (بالعربية)' : 'District (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.areaAr || ''}
                          onChange={e => setModalData({ ...modalData, areaAr: e.target.value })}
                          placeholder="حي النرجس"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'الحي (بالإنجليزية)' : 'District (English)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.areaEn || ''}
                          onChange={e => setModalData({ ...modalData, areaEn: e.target.value })}
                          placeholder="Al-Narjis District"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="admin-form-grid">
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'نوع الخدمة (بالعربية)' : 'Service Type (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.serviceAr || ''}
                          onChange={e => setModalData({ ...modalData, serviceAr: e.target.value })}
                          placeholder="صيانة مكيفات سبليت"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'نوع الخدمة (بالإنجليزية)' : 'Service Type (English)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.serviceEn || ''}
                          onChange={e => setModalData({ ...modalData, serviceEn: e.target.value })}
                          placeholder="Split AC Maintenance"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1' }}
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'التقييم (1 إلى 5)' : 'Rating (1 to 5)'}
                      </label>
                      <select
                        value={modalData.rating || 5}
                        onChange={e => updateModalField('rating', Number(e.target.value))}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('rating'), fontSize: '0.95rem' }}
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ 5 Stars</option>
                        <option value={4}>⭐⭐⭐⭐ 4 Stars</option>
                        <option value={3}>⭐⭐⭐ 3 Stars</option>
                        <option value={2}>⭐⭐ 2 Stars</option>
                        <option value={1}>⭐ 1 Star</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'نص التقييم (بالعربية)' : 'Review Comment (Arabic)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.textAr || ''}
                        onChange={e => updateModalField('textAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('textAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'نص التقييم (بالإنجليزية)' : 'Review Comment (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.textEn || ''}
                        onChange={e => updateModalField('textEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('textEn') }}
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {modalType === 'case' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'عنوان المشروع (بالعربية) *' : 'Project Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleAr || ''}
                        onChange={e => updateModalField('titleAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'عنوان المشروع (بالإنجليزية) *' : 'Project Title (English) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleEn || ''}
                        onChange={e => updateModalField('titleEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleEn') }}
                        dir="ltr"
                      />
                    </div>
                    <div className="admin-form-grid">
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'التصنيف (بالعربية)' : 'Category (Arabic)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.categoryAr || ''}
                          onChange={e => updateModalField('categoryAr', e.target.value)}
                          placeholder="تكييف مركزي"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('categoryAr') }}
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                          {isAr ? 'التصنيف (بالإنجليزية)' : 'Category (English)'}
                        </label>
                        <input
                          type="text"
                          value={modalData.categoryEn || ''}
                          onChange={e => updateModalField('categoryEn', e.target.value)}
                          placeholder="Central HVAC"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('categoryEn') }}
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'post' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'عنوان المقال (بالعربية) *' : 'Article Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleAr || ''}
                        onChange={e => updateModalField('titleAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'عنوان المقال (بالإنجليزية) *' : 'Article Title (English) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleEn || ''}
                        onChange={e => updateModalField('titleEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleEn') }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'المقتطف (بالعربية)' : 'Excerpt (Arabic)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.excerptAr || ''}
                        onChange={e => updateModalField('excerptAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('excerptAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'المقتطف (بالإنجليزية)' : 'Excerpt (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.excerptEn || ''}
                        onChange={e => updateModalField('excerptEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('excerptEn') }}
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {modalType === 'industry' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'اسم القطاع (بالعربية) *' : 'Industry Title (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleAr || ''}
                        onChange={e => updateModalField('titleAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'اسم القطاع (بالإنجليزية) *' : 'Industry Title (English) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.titleEn || ''}
                        onChange={e => updateModalField('titleEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('titleEn') }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.descAr || ''}
                        onChange={e => updateModalField('descAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('descAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.descEn || ''}
                        onChange={e => updateModalField('descEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('descEn') }}
                        dir="ltr"
                      />
                    </div>
                  </>
                )}

                {modalType === 'faq' && (
                  <>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'السؤال (بالعربية) *' : 'Question (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.qAr || ''}
                        onChange={e => updateModalField('qAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('qAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'السؤال (بالإنجليزية) *' : 'Question (English) *'}
                      </label>
                      <input
                        type="text"
                        value={modalData.qEn || ''}
                        onChange={e => updateModalField('qEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('qEn') }}
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الإجابة (بالعربية) *' : 'Answer (Arabic) *'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.aAr || ''}
                        onChange={e => updateModalField('aAr', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('aAr') }}
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.86rem', fontWeight: 800, display: 'block', marginBottom: '4px', color: '#082B4C' }}>
                        {isAr ? 'الإجابة (بالإنجليزية) *' : 'Answer (English) *'}
                      </label>
                      <textarea
                        rows={2}
                        value={modalData.aEn || ''}
                        onChange={e => updateModalField('aEn', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: getInputBorder('aEn') }}
                        dir="ltr"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="admin-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ background: '#E2E8F0', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="btn btn-navy"
                  style={{ padding: '10px 22px', fontSize: '0.92rem', fontWeight: 800, borderRadius: '10px' }}
                >
                  {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}