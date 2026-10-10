import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DETAILED_SERVICES,
  CASE_STUDIES,
  BLOG_POSTS,
  GALLERY_ITEMS,
  VIDEO_ITEMS,
  NAV_STRUCTURE,
} from '../content/siteData.js';
import { TESTIMONIALS_DATA, FAQS_DATA } from '../data.js';
import { API_BASE } from '../config.js';

const DataContext = createContext(null);

const DEFAULT_INDUSTRIES = [
  {
    id: 'residential',
    icon: 'home',
    titleAr: 'الفلل والقصور والمجمعات السكنية',
    titleEn: 'Residential Villas & Luxury Compounds',
    descAr: 'خدمة صيانة منزلية فورية لجميع مكيفات وثلاجات وفريزرات المنزل مع المحافظة التامة على نظافة الأثاث والمفروشات.',
    descEn: 'Same-day on-site maintenance for home ACs, refrigerators, and freezers with 100% floor and furniture protection.',
    featuresAr: ['استجابة سريعة في نفس اليوم في كافة أحياء الرياض', 'فنيون مؤهلون ومعتمدون بأعلى درجات الأمانة', 'عقود صيانة سنوية مخصصة للعائلات مع خصومات'],
    featuresEn: ['Same-day arrival across all Riyadh neighborhoods', 'Certified technicians with strict professionalism', 'Customized annual family maintenance plans with discounts'],
  },
  {
    id: 'restaurants',
    icon: 'bolt',
    titleAr: 'المطاعم والمقاهي وسلاسل الأغذية',
    titleEn: 'Restaurants, Cafes & Food Chains',
    descAr: 'صيانة طارئة لغرف التبريد والتجميد (Walk-in Freezers) وصانعات الثلج ومكيفات صالات الضيوف لضمان استمرارية التشغيل.',
    descEn: 'Emergency service for walk-in freezers, ice machines, and dining hall HVAC to prevent food inventory loss.',
    featuresAr: ['خط ساخن للطوارئ 24/7 للمطاعم المتعاقدة', 'صيانة متخصصة لغرف التجميد والتبريد التجاري', 'تقارير فنية معتمدة تفي باشتراطات البلدية والسلامة'],
    featuresEn: ['24/7 emergency service line for contracted restaurants', 'Specialized commercial refrigeration care', 'Official municipal and food-safety compliance logs'],
  },
  {
    id: 'corporate',
    icon: 'contract',
    titleAr: 'المكاتب والشركات والمباني الإدارية',
    titleEn: 'Corporate Offices & Business Towers',
    descAr: 'برامج صيانة دورية للمكيفات المركزية ووحدات البكج لضمان بيئة عمل مريحة وهادئة للموظفين طوال ساعات العمل.',
    descEn: 'Preventative HVAC maintenance for ducted package systems ensuring clean, quiet, productive working environments.',
    featuresAr: ['جدولة الزيارات في أوقات مرنة خارج ساعات الدوام', 'موازنة تدفق الهواء CFM في كافة المكاتب والاجتماعات', 'فواتير ضريبية إلكترونية معتمدة للمنشآت'],
    featuresEn: ['Flexible scheduling outside business operating hours', 'CFM airflow balancing across all meeting rooms', 'Official ZATCA-compliant electronic tax invoicing'],
  },
  {
    id: 'retail',
    icon: 'fridge',
    titleAr: 'السوبرماركت ومحلات التجزئة الغذائية',
    titleEn: 'Supermarkets & Retail Grocery Stores',
    descAr: 'صيانة وإصلاح ثلاجات العرض المفتوحة، فريزرات الآيس كريم واللحوم، وأنظمة التبريد المركزي للمتاجر.',
    descEn: 'Repairing multi-deck open display chillers, commercial chest freezers, and supermarket central racks.',
    featuresAr: ['كشف سريع لتسريبات الفريون وضبط درجات الحرارة', 'صيانة مراوح المبخر ومكثفات التبريد الكبيرة', 'قطع غيار أصلية متوفرة لتسريع الإصلاح'],
    featuresEn: ['Fast freon leak detection and digital temperature tuning', 'Heavy-duty evaporator fan and condenser overhauls', 'Immediate stock of commercial refrigeration spare parts'],
  },
];

export function DataProvider({ children }) {
  // One-time content refresh; preserve custom content and all booking inquiries.
  const contentVersion = '2026-10-services-v3';
  if (localStorage.getItem('jawzaa_content_version') !== contentVersion) {
    const defaults = { services: Object.values(DETAILED_SERVICES), reviews: TESTIMONIALS_DATA, cases: CASE_STUDIES, posts: BLOG_POSTS, industries: DEFAULT_INDUSTRIES, faqs: FAQS_DATA, gallery: GALLERY_ITEMS };
    for (const [key, fresh] of Object.entries(defaults)) {
      const storageKey = 'jawzaa_db_' + key;
      try {
        const old = JSON.parse(localStorage.getItem(storageKey) || 'null');
        if (Array.isArray(old)) {
          const merged = old.map(item => {
            const match = fresh.find(entry => item.slug ? entry.slug === item.slug : item.id != null ? entry.id === item.id : entry.qEn === item.qEn);
            return match ? { ...item, ...match } : item;
          }).filter(item => !/washer|washing.machine|غسال/i.test(JSON.stringify(item)));
          localStorage.setItem(storageKey, JSON.stringify(merged));
        }
      } catch { localStorage.removeItem(storageKey); }
    }
    localStorage.setItem('jawzaa_content_version', contentVersion);
  }
  // 1. Services
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_services');
    return saved ? JSON.parse(saved) : Object.values(DETAILED_SERVICES);
  });

  // 2. Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_reviews');
    return saved ? JSON.parse(saved) : TESTIMONIALS_DATA;
  });

  // 3. Case Studies
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_cases');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(c => {
          const fresh = CASE_STUDIES.find(x => x.id === c.id);
          return fresh ? { ...c, image: fresh.image, titleAr: fresh.titleAr, titleEn: fresh.titleEn } : c;
        });
      } catch (e) { /* ignore */ }
    }
    return CASE_STUDIES;
  });

  // 4. Blog Posts
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_posts');
    return saved ? JSON.parse(saved) : BLOG_POSTS;
  });

  // 5. Industries
  const [industries, setIndustries] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_industries');
    return saved ? JSON.parse(saved) : DEFAULT_INDUSTRIES;
  });

  // 6. FAQs
  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_faqs');
    return saved ? JSON.parse(saved) : FAQS_DATA;
  });

  // 7. Gallery
  const [gallery, setGallery] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_gallery');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(g => {
          const fresh = GALLERY_ITEMS.find(x => x.id === g.id);
          return fresh ? { ...g, src: fresh.src, titleAr: fresh.titleAr, titleEn: fresh.titleEn } : g;
        });
      } catch (e) { /* ignore */ }
    }
    return GALLERY_ITEMS;
  });

  // 8. Contact & Booking Inquiries
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem('jawzaa_db_inquiries');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'inq-1',
        name: 'عبدالله المطيري',
        phone: '0551234567',
        area: 'حي الياسمين',
        service: 'صيانة مكيفات سبليت وشحن فريون',
        notes: 'المكيف في غرفة المعيشة يخرج هواء حار وصوت خفيف في الوحدة الخارجية',
        date: '2026-08-30 14:30',
        status: 'new',
      },
      {
        id: 'inq-2',
        name: 'أم فهد العتيبي',
        phone: '0509876543',
        area: 'حي النرجس',
        service: 'إصلاح ثلاجة منزلية (تسريب ماء)',
        notes: 'الثلاجة تنزل ماء تحت الأدراج والتبريد ضعيف في الفريزر',
        date: '2026-08-30 11:15',
        status: 'contacted',
      },
      {
        id: 'inq-3',
        name: 'م. خالد الدوسري',
        phone: '0567788990',
        area: 'حي الروضة',
        service: 'لف محرك مروحة مكيف مركزي',
        notes: 'موتور البلاور للمكيف البكج احترق ويحتاج إعادة لف نحاس نقي',
        date: '2026-08-29 18:45',
        status: 'completed',
      },
    ];
  });

  // Auto persist to localStorage
  useEffect(() => {
    localStorage.setItem('jawzaa_db_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_industries', JSON.stringify(industries));
  }, [industries]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_faqs', JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('jawzaa_db_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jawzaa_admin_token') || 'dev-admin-token';
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  };

  // Sync with Backend API on load
  useEffect(() => {
    let isMounted = true;
    const syncBackendData = async () => {
      try {
        const [servicesRes, reviewsRes, casesRes, postsRes, industriesRes, faqsRes, inquiriesRes] =
          await Promise.allSettled([
            fetch(`${API_BASE}/services`).then(r => r.json()),
            fetch(`${API_BASE}/reviews`).then(r => r.json()),
            fetch(`${API_BASE}/portfolio`).then(r => r.json()),
            fetch(`${API_BASE}/blog`).then(r => r.json()),
            fetch(`${API_BASE}/industries`).then(r => r.json()),
            fetch(`${API_BASE}/faqs`).then(r => r.json()),
            fetch(`${API_BASE}/contact`).then(r => r.json()),
          ]);

        if (!isMounted) return;

        if (servicesRes.status === 'fulfilled' && servicesRes.value?.success && servicesRes.value?.data?.length) {
          setServices(servicesRes.value.data);
        }
        if (reviewsRes.status === 'fulfilled' && reviewsRes.value?.success && reviewsRes.value?.data?.length) {
          setReviews(reviewsRes.value.data);
        }
        if (casesRes.status === 'fulfilled' && casesRes.value?.success && casesRes.value?.data?.length) {
          setCases(casesRes.value.data);
        }
        if (postsRes.status === 'fulfilled' && postsRes.value?.success && postsRes.value?.data?.length) {
          setPosts(postsRes.value.data);
        }
        if (industriesRes.status === 'fulfilled' && industriesRes.value?.success && industriesRes.value?.data?.length) {
          setIndustries(industriesRes.value.data);
        }
        if (faqsRes.status === 'fulfilled' && faqsRes.value?.success && faqsRes.value?.data?.length) {
          setFaqs(faqsRes.value.data);
        }
        if (inquiriesRes.status === 'fulfilled' && inquiriesRes.value?.success && inquiriesRes.value?.data?.length) {
          setInquiries(inquiriesRes.value.data);
        }
      } catch (err) {
        console.warn('[DataContext] Backend API offline or fallback mode:', err.message);
      }
    };

    syncBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- CRUD ACTIONS WITH REAL BACKEND SYNC ---

  // Services CRUD
  const saveService = svc => {
    setServices(prev => {
      const idx = prev.findIndex(s => s.slug === svc.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...svc };
        return copy;
      }
      return [...prev, svc];
    });

    fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(svc),
    }).catch(err => console.warn('Could not sync service to backend:', err));
  };

  const deleteService = slug => {
    setServices(prev => prev.filter(s => s.slug !== slug));

    fetch(`${API_BASE}/services/${slug}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete service from backend:', err));
  };

  // Reviews CRUD
  const saveReview = rev => {
    const itemWithId = { ...rev, id: rev.id || Date.now() };
    setReviews(prev => {
      const idx = prev.findIndex(r => String(r.id) === String(itemWithId.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...itemWithId };
        return copy;
      }
      return [itemWithId, ...prev];
    });

    fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemWithId),
    }).catch(err => console.warn('Could not sync review to backend:', err));
  };

  const deleteReview = id => {
    setReviews(prev => prev.filter(r => String(r.id) !== String(id)));

    fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete review from backend:', err));
  };

  // Cases CRUD
  const saveCase = caseItem => {
    const itemWithId = { ...caseItem, id: caseItem.id || `case-${Date.now()}` };
    setCases(prev => {
      const idx = prev.findIndex(c => String(c.id) === String(itemWithId.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...itemWithId };
        return copy;
      }
      return [...prev, itemWithId];
    });

    fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemWithId),
    }).catch(err => console.warn('Could not sync case study to backend:', err));
  };

  const deleteCase = id => {
    setCases(prev => prev.filter(c => String(c.id) !== String(id)));

    fetch(`${API_BASE}/portfolio/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete case study from backend:', err));
  };

  // Posts CRUD
  const savePost = post => {
    const itemWithId = { ...post, id: post.id || `post-${Date.now()}` };
    setPosts(prev => {
      const idx = prev.findIndex(p => String(p.id) === String(itemWithId.id) || p.slug === itemWithId.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...itemWithId };
        return copy;
      }
      return [itemWithId, ...prev];
    });

    fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemWithId),
    }).catch(err => console.warn('Could not sync blog post to backend:', err));
  };

  const deletePost = id => {
    setPosts(prev => prev.filter(p => String(p.id) !== String(id) && p.slug !== id));

    fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete blog post from backend:', err));
  };

  // Industries CRUD
  const saveIndustry = ind => {
    const itemWithId = { ...ind, id: ind.id || `ind-${Date.now()}` };
    setIndustries(prev => {
      const idx = prev.findIndex(i => String(i.id) === String(itemWithId.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...itemWithId };
        return copy;
      }
      return [...prev, itemWithId];
    });

    fetch(`${API_BASE}/industries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(itemWithId),
    }).catch(err => console.warn('Could not sync industry to backend:', err));
  };

  const deleteIndustry = id => {
    setIndustries(prev => prev.filter(i => String(i.id) !== String(id)));

    fetch(`${API_BASE}/industries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete industry from backend:', err));
  };

  // FAQs CRUD
  const saveFaq = faq => {
    setFaqs(prev => {
      const idx = prev.findIndex((item, index) => index === faq.index || (faq.id && item.id === faq.id));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = faq;
        return copy;
      }
      return [...prev, faq];
    });

    fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(faq),
    }).catch(err => console.warn('Could not sync FAQ to backend:', err));
  };

  const deleteFaq = index => {
    const target = faqs[index];
    setFaqs(prev => prev.filter((_, idx) => idx !== index));

    if (target?.id) {
      fetch(`${API_BASE}/faqs/${target.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      }).catch(err => console.warn('Could not delete FAQ from backend:', err));
    }
  };

  // Inquiries & Bookings CRUD
  const saveInquiry = inq => {
    const newInq = {
      ...inq,
      id: inq.id || `inq-${Date.now()}`,
      date: inq.date || new Date().toLocaleString('ar-SA'),
      status: inq.status || 'new',
    };
    setInquiries(prev => [newInq, ...prev]);

    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newInq),
    }).catch(err => console.warn('Could not sync inquiry to backend:', err));
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries(prev => prev.map(inq => (String(inq.id) === String(id) ? { ...inq, status } : inq)));

    fetch(`${API_BASE}/contact/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    }).catch(err => console.warn('Could not update inquiry status on backend:', err));
  };

  const deleteInquiry = id => {
    setInquiries(prev => prev.filter(inq => String(inq.id) !== String(id)));

    fetch(`${API_BASE}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }).catch(err => console.warn('Could not delete inquiry from backend:', err));
  };

  // Reset to default factory data
  const resetAllData = () => {
    localStorage.removeItem('jawzaa_db_services');
    localStorage.removeItem('jawzaa_db_reviews');
    localStorage.removeItem('jawzaa_db_cases');
    localStorage.removeItem('jawzaa_db_posts');
    localStorage.removeItem('jawzaa_db_industries');
    localStorage.removeItem('jawzaa_db_faqs');
    localStorage.removeItem('jawzaa_db_gallery');
    localStorage.removeItem('jawzaa_db_inquiries');

    setServices(Object.values(DETAILED_SERVICES));
    setReviews(TESTIMONIALS_DATA);
    setCases(CASE_STUDIES);
    setPosts(BLOG_POSTS);
    setIndustries(DEFAULT_INDUSTRIES);
    setFaqs(FAQS_DATA);
    setGallery(GALLERY_ITEMS);
    setInquiries([
      {
        id: 'inq-1',
        name: 'عبدالله المطيري',
        phone: '0551234567',
        area: 'حي الياسمين',
        service: 'صيانة مكيفات سبليت وشحن فريون',
        notes: 'المكيف في غرفة المعيشة يخرج هواء حار وصوت خفيف في الوحدة الخارجية',
        date: '2026-08-30 14:30',
        status: 'new',
      },
      {
        id: 'inq-2',
        name: 'أم فهد العتيبي',
        phone: '0509876543',
        area: 'حي النرجس',
        service: 'إصلاح ثلاجة منزلية (تسريب ماء)',
        notes: 'الثلاجة تنزل ماء تحت الأدراج والتبريد ضعيف في الفريزر',
        date: '2026-08-30 11:15',
        status: 'contacted',
      },
      {
        id: 'inq-3',
        name: 'م. خالد الدوسري',
        phone: '0567788990',
        area: 'حي الروضة',
        service: 'لف محرك مروحة مكيف مركزي',
        notes: 'موتور البلاور للمكيف البكج احترق ويحتاج إعادة لف نحاس نقي',
        date: '2026-08-29 18:45',
        status: 'completed',
      },
    ]);
  };

  return (
    <DataContext.Provider
      value={{
        services,
        reviews,
        cases,
        posts,
        industries,
        faqs,
        gallery,
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
        resetAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }
  return ctx;
}
