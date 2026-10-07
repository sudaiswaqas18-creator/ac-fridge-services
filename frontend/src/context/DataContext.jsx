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
    descAr: 'خدمة صيانة منزلية فورية لجميع مكيفات وثلاجات وغسالات المنزل مع المحافظة التامة على نظافة الأثاث والمفروشات.',
    descEn: 'Same-day on-site maintenance for home ACs, refrigerators, and washers with 100% floor and furniture protection.',
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
    featuresEn: ['24/7 emergency dispatch line for contracted restaurants', 'Specialized commercial refrigeration care', 'Official municipal and food-safety compliance logs'],
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

  // Sync with Backend API on load
  useEffect(() => {
    fetch(`${API_BASE}/services`)
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.length > 0) {
          // Sync live API data
        }
      })
      .catch(() => {
        // Offline / fallback mode
      });
  }, []);

  // --- CRUD ACTIONS ---

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
  };

  const deleteService = slug => {
    setServices(prev => prev.filter(s => s.slug !== slug));
  };

  // Reviews CRUD
  const saveReview = rev => {
    setReviews(prev => {
      const idx = prev.findIndex(r => r.id === rev.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...rev };
        return copy;
      }
      return [{ ...rev, id: rev.id || Date.now() }, ...prev];
    });
  };

  const deleteReview = id => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  // Cases CRUD
  const saveCase = caseItem => {
    setCases(prev => {
      const idx = prev.findIndex(c => c.id === caseItem.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...caseItem };
        return copy;
      }
      return [...prev, { ...caseItem, id: caseItem.id || `case-${Date.now()}` }];
    });
  };

  const deleteCase = id => {
    setCases(prev => prev.filter(c => c.id !== id));
  };

  // Posts CRUD
  const savePost = post => {
    setPosts(prev => {
      const idx = prev.findIndex(p => p.id === post.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...post };
        return copy;
      }
      return [{ ...post, id: post.id || `post-${Date.now()}` }, ...prev];
    });
  };

  const deletePost = id => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  // Industries CRUD
  const saveIndustry = ind => {
    setIndustries(prev => {
      const idx = prev.findIndex(i => i.id === ind.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...ind };
        return copy;
      }
      return [...prev, { ...ind, id: ind.id || `ind-${Date.now()}` }];
    });
  };

  const deleteIndustry = id => {
    setIndustries(prev => prev.filter(i => i.id !== id));
  };

  // FAQs CRUD
  const saveFaq = faq => {
    setFaqs(prev => {
      const idx = prev.findIndex((_, index) => index === faq.index);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = faq;
        return copy;
      }
      return [...prev, faq];
    });
  };

  const deleteFaq = index => {
    setFaqs(prev => prev.filter((_, idx) => idx !== index));
  };

  // Inquiries & Bookings CRUD
  const saveInquiry = inq => {
    setInquiries(prev => [{ ...inq, id: inq.id || `inq-${Date.now()}`, date: inq.date || new Date().toLocaleString(), status: inq.status || 'new' }, ...prev]);
  };

  const updateInquiryStatus = (id, status) => {
    setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status } : inq));
  };

  const deleteInquiry = id => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
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
