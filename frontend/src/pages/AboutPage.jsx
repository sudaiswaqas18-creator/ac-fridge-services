import React from 'react';
import CompanySectionNav from '../components/CompanySectionNav.jsx';
import { BRAND, waLink } from '../translations.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { I } from '../Icons.jsx';
import storefrontImg from '../assets/media/jawzaa-storefront-open.webp';
import workshopImg from '../assets/media/workshop-interior.webp';

export default function AboutPage() {
  const { isRTL } = useLanguage();

  const timeline = [
    {
      year: '2014',
      titleAr: 'تأسيس المؤسسة بالرياض',
      titleEn: 'Foundation in Riyadh',
      descAr: 'انطلاق أول ورشة متخصصة في صيانة المكيفات ولف المحركات الكهربائية بحي الروضة.',
      descEn: 'Launch of our first specialized HVAC and motor rewinding workshop in Al-Rawdah.',
    },
    {
      year: '2018',
      titleAr: 'إطلاق أسطول الصيانة المتنقل',
      titleEn: 'Mobile On-Site Fleet Launch',
      descAr: 'تجهيز 6 سيارات صيانة متنقلة لتقديم خدمات الإصلاح الفوري في منازل العملاء بمعدات متقدمة.',
      descEn: 'Equipping 6 fully stocked mobile service vans for rapid same-day residential repairs.',
    },
    {
      year: '2022',
      titleAr: 'توسعة قسم لف الموتورات والباكج',
      titleEn: 'Central HVAC & Motor Bay Expansion',
      descAr: 'إدخال أجهزة الفحص الرقمية وأفران تجفيف العزل الحراري المتطورة للمحركات الكبيرة.',
      descEn: 'Upgrading to digital diagnostic analyzers and thermal baking ovens for heavy-duty industrial motors.',
    },
    {
      year: '2026',
      titleAr: 'الريادة والاعتماد الشامل',
      titleEn: 'Market Leadership & Certification',
      descAr: 'خدمة أكثر من 5,500 عميل سنوي في جميع أحياء الرياض مع نسبة رضا معتمدة تتجاوز 99%.',
      descEn: 'Serving over 5,500 clients annually across all Riyadh districts with 99%+ customer satisfaction.',
    },
  ];

  const teamMembers = [
    {
      nameAr: 'م. راشد القحطاني',
      nameEn: 'Eng. Rashed Al-Qahtani',
      roleAr: 'المشرف الهندسي العام (خبير تكييف مركزي)',
      roleEn: 'Lead Mechanical Engineer (HVAC Specialist)',
      icon: I.ac,
      expAr: '15 عاماً من الخبرة في أنظمة التبريد والتكييف المركزي والباكج في المملكة',
      expEn: '15+ years experience in central HVAC & chiller systems across KSA',
      cert: isRTL ? 'معتمد هندسياً' : 'Licensed Engineer',
    },
    {
      nameAr: 'فني أول / سليم خان',
      nameEn: 'Master Tech / Saleem Khan',
      roleAr: 'كبير أخصائيي لف الموتورات والمحركات',
      roleEn: 'Master Motor Rewinding Specialist',
      icon: I.motor,
      expAr: '12 عاماً في لف محركات الضغط العالي ومضخات المياه بالنحاس النقي عزل Class H',
      expEn: '12+ years expertise in precision motor rewinding and Class H insulation',
      cert: isRTL ? 'فني لف رئيسي' : 'Master Rewinder',
    },
    {
      nameAr: 'فني أول / كمال الدين',
      nameEn: 'Senior Tech / Kamal Al-Deen',
      roleAr: 'أخصائي صيانة الثلاجات والفريزرات الذكية',
      roleEn: 'Smart Refrigerator & Freezer Diagnostics',
      icon: I.fridge,
      expAr: '10 أعوام في صيانة كروت التحكم ودورات النوفروست لسامسونج وإل جي وهيتاشي',
      expEn: '10+ years in inverter PCB diagnostics and no-frost refrigeration circuits',
      cert: isRTL ? 'أخصائي إلكترونيات' : 'Electronics Specialist',
    },
  ];

  const values = [
    {
      icon: I.shield,
      titleAr: 'النزاهة والأمانة المهنية',
      titleEn: 'Integrity & Transparency',
      descAr: 'تشخيص دقيق للعطل الحقيقي دون مبالغة، وتسعير واضح قبل بدء أي عمل.',
      descEn: 'Accurate diagnosis of the root cause with upfront pricing and zero hidden fees.',
    },
    {
      icon: I.bolt,
      titleAr: 'السرعة والوصول الفوري',
      titleEn: 'Punctuality & Fast Service',
      descAr: 'نصل إلى باب منزلك في الموعد المحدد بنفس اليوم في كافة أحياء الرياض خلال 30 دقيقة.',
      descEn: 'Same-day technician arrival at your scheduled appointment time across Riyadh.',
    },
    {
      icon: I.parts,
      titleAr: 'الجودة وقطع الغيار الأصلية',
      titleEn: '100% Genuine OEM Quality',
      descAr: 'استخدام القطع المعتمدة وأسلاك النحاس النقي لضمان ديمومة الجهاز لسنوات طويلة.',
      descEn: 'Strict usage of original certified components and pure copper to ensure longevity.',
    },
    {
      icon: I.star,
      titleAr: 'الضمان الحقيقي المعتمد',
      titleEn: 'Guaranteed Peace of Mind',
      descAr: 'سند ضمان خطي على كافة الإصلاحات مع استعداد تام للمتابعة المجانية بدون تردد.',
      descEn: 'Official written warranty certificates covering both labor and replacement parts.',
    },
  ];

  return (
    <div className="about-page-view">
      {/* Hero Banner */}
      <section className="subpage-hero-banner about-hero-banner">
        <div className="subpage-hero-glow" />
        <div className="container subpage-hero-content">
          <span className="subpage-hero-badge">
            <span className="badge-icon">{I.shield}</span>
            {isRTL ? 'عن مؤسسة جوزاء للتبريد والتكييف' : 'About Jawzaa HVAC & Appliance Specialists'}
          </span>
          <h1 className="subpage-hero-title">
            {isRTL ? 'أكثر من 14 عاماً من الخبرة والريادة في صيانة الأجهزة بالرياض' : '14+ Years of HVAC & Appliance Leadership in Riyadh'}
          </h1>
          <p className="subpage-hero-desc">
            {isRTL
              ? 'مؤسسة سعودية متخصصة تجمع بين الخبرة الميدانية العميقة، أحدث المعدات الرقمية، والكوادر الفنية المؤهلة لتقديم أرقى خدمات الصيانة المنزلية والتجارية.'
              : 'A specialized Saudi technical enterprise combining deep field experience, precision diagnostic analyzers, and certified technicians to deliver premier on-site repair.'}
          </p>
        </div>
      </section>

      <CompanySectionNav />


      <div className="company-editorial">
        <section className="company-intro container">
          <div className="company-intro-copy">
            <span className="section-tag">{isRTL ? 'خبرة تثق بها' : 'Experience You Can Rely On'}</span>
            <h2>{isRTL ? 'عناية مدروسة، من الفحص إلى الإصلاح.' : 'Careful diagnosis. Work done with care.'}</h2>
            <p>{isRTL ? 'من صيانة تكييف منزلك إلى إصلاح الثلاجات ولف المحركات، نجمع الخبرة الفنية مع خطوات واضحة وتجربة خدمة مريحة.' : 'From your home cooling system to refrigeration, washing machine repair and motor rewinding, we bring technical experience and a clear, thoughtful approach to every repair.'}</p>
            <p>{isRTL ? 'تدعم ورشتنا المتخصصة فرق الصيانة الميدانية في الرياض. نوضح المشكلة وخيارات الإصلاح قبل البدء، ثم نختبر الأداء بعد إتمام العمل.' : 'Our specialist workshop supports on-site teams across Riyadh. We explain the fault and repair options before work begins, then check performance before completing the visit.'}</p>
            <a className="btn btn-navy" href={waLink()} target="_blank" rel="noopener">{isRTL ? 'تحدث مع فريقنا' : 'Talk to Our Team'} {I.arrowR}</a>
          </div>
          <div className="company-photo"><img src={storefrontImg} alt={isRTL ? 'ورشة جوزاء في الرياض' : 'Jawzaa workshop in Riyadh'} /><div>{I.pin}<span>{isRTL ? 'ورشة متخصصة. خدمة في جميع أحياء الرياض.' : 'A specialist workshop. Serving all of Riyadh.'}</span></div></div>
        </section>
        <div className="company-stats container">{[['14+', 'Years of Experience', 'سنوات خبرة'], ['5,500+', 'Appliances Repaired', 'جهاز تم إصلاحه'], ['99.4%', 'Customer Rating', 'تقييم العملاء']].map(([value,en,ar]) => <div key={en}><strong>{value}</strong><span>{isRTL ? ar : en}</span></div>)}</div>
        <section className="company-standards">
          <div className="container company-standards-layout">
            <div className="company-section-intro"><span className="section-tag">{isRTL ? 'معاييرنا' : 'Our Service Standards'}</span><h2>{isRTL ? 'الوضوح في كل خطوة. الجودة في كل تفصيلة.' : 'Clear at every step. Care in every detail.'}</h2><p>{isRTL ? 'مبادئ عملية توجه طريقة عملنا، من أول اتصال حتى تسليم الجهاز.' : 'Practical commitments that guide our work, from your first call to the final performance check.'}</p><img src={workshopImg} alt={isRTL ? 'داخل ورشة الصيانة' : 'Inside our service workshop'} loading="lazy" /></div>
            <div className="company-values">{values.map((value,index) => <article key={value.titleEn}><span className="company-value-icon">{value.icon}</span><div><span className="company-step-number">0{index+1}</span><h3>{isRTL ? value.titleAr : value.titleEn}</h3><p>{isRTL ? value.descAr : value.descEn}</p></div></article>)}</div>
          </div>
        </section>
        <section className="company-journey container"><div className="company-section-intro"><span className="section-tag">{isRTL ? 'مسيرتنا' : 'Our Journey'}</span><h2>{isRTL ? 'خبرة تنمو مع احتياجات عملائنا' : 'Growing With the Needs of Our Customers'}</h2></div><div className="company-timeline">{timeline.map(item => <article key={item.year}><span>{item.year}</span><h3>{isRTL ? item.titleAr : item.titleEn}</h3><p>{isRTL ? item.descAr : item.descEn}</p></article>)}</div></section>
        <section className="company-people"><div className="container"><div className="section-header"><span className="section-tag">{isRTL ? 'فريقنا المتخصص' : 'The People Behind the Work'}</span><h2 className="section-title">{isRTL ? 'خبرات متكاملة لخدمة أفضل' : 'Specialist Skills. One Dedicated Team.'}</h2><p className="section-subtitle">{isRTL ? 'التكييف والتبريد وصيانة الغسالات ولف المحركات، بإشراف فريق متخصص.' : 'Focused expertise in HVAC, refrigeration, washing machines and motor rewinding.'}</p></div><div className="company-team">{teamMembers.map(member => <article key={member.nameEn}><div className="company-member-top"><span>{member.icon}</span><small>{member.cert}</small></div><h3>{isRTL ? member.nameAr : member.nameEn}</h3><h4>{isRTL ? member.roleAr : member.roleEn}</h4><p>{isRTL ? member.expAr : member.expEn}</p></article>)}</div></div></section>
        <section className="company-booking container"><div><span>{isRTL ? 'نحن هنا لمساعدتك' : 'Here When You Need Us'}</span><h2>{isRTL ? 'لنجد الحل المناسب لجهازك.' : 'Let’s Find the Right Solution for Your Equipment.'}</h2><p>{isRTL ? BRAND.hoursAr : BRAND.hoursEn}</p></div><div className="company-booking-actions"><a className="btn btn-gold" href={waLink()} target="_blank" rel="noopener">{I.whatsapp}{isRTL ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</a><a className="btn btn-gold-outline" href={'tel:' + BRAND.phonePrimaryIntl}>{I.phone}{isRTL ? 'اتصال مباشر' : 'Call Our Team'}</a></div></section>
      </div>
    </div>
  );
}
